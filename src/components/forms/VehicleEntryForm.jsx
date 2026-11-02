import React, { useState } from 'react';
import {
  Car,
  Bike,
  Truck,
  Accessibility,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ListOrdered,
  ArrowRight,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { normalizePlate } from '../../utils/formatters';
import TicketModal from '../common/TicketModal';

export default function VehicleEntryForm() {
  const { allocateVehicle, addToWaitingQueue, summaryMetrics, accessibleHeap, reservedHeap, standardHeap } = useParking();

  const [formData, setFormData] = useState({
    registrationNumber: '',
    vehicleType: 'Car',
    driverName: '',
    contactNumber: '',
    isAccessible: false,
    isReserved: false,
  });

  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [queuePrompt, setQueuePrompt] = useState(null);

  // Suggested nearest slot preview based on current form eligibility
  const previewNearestSlot = () => {
    if (formData.isAccessible) {
      return accessibleHeap.peekMin() || standardHeap.peekMin();
    }
    if (formData.isReserved) {
      return reservedHeap.peekMin() || standardHeap.peekMin();
    }
    return standardHeap.peekMin();
  };

  const nearestCandidate = previewNearestSlot();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setQueuePrompt(null);

    const plate = normalizePlate(formData.registrationNumber);
    if (!plate || plate.length < 3) {
      setError('Please provide a valid vehicle registration plate (at least 3 characters).');
      return;
    }

    const result = allocateVehicle(formData);

    if (result.success) {
      setSuccessData(result);
      setIsTicketOpen(true);
      // Reset form
      setFormData({
        registrationNumber: '',
        vehicleType: 'Car',
        driverName: '',
        contactNumber: '',
        isAccessible: false,
        isReserved: false,
      });
    } else {
      if (result.suggestQueue) {
        setQueuePrompt({
          message: result.error,
          vehicleData: { ...formData, registrationNumber: plate },
        });
      } else {
        setError(result.error || 'Allocation failed. Please check inputs.');
      }
    }
  };

  const handleAcceptQueue = () => {
    if (!queuePrompt) return;
    const res = addToWaitingQueue(queuePrompt.vehicleData);
    if (res.success) {
      setQueuePrompt(null);
      setFormData({
        registrationNumber: '',
        vehicleType: 'Car',
        driverName: '',
        contactNumber: '',
        isAccessible: false,
        isReserved: false,
      });
    } else {
      setError(res.error);
    }
  };

  // Quick Preset fillers for realistic operator testing
  const fillSample = (type) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    if (type === 'ACCESSIBLE') {
      setFormData({
        registrationNumber: `DEMO-ACCESS-${randomNum}`,
        vehicleType: 'Car',
        driverName: 'Demo Accessible Driver',
        contactNumber: '',
        isAccessible: true,
        isReserved: false,
      });
    } else if (type === 'VIP') {
      setFormData({
        registrationNumber: `DEMO-VIP-${randomNum}`,
        vehicleType: 'SUV',
        driverName: 'Demo Reserved Driver',
        contactNumber: '',
        isAccessible: false,
        isReserved: true,
      });
    } else if (type === 'BIKE') {
      setFormData({
        registrationNumber: `DEMO-BIKE-${randomNum}`,
        vehicleType: 'Bike',
        driverName: 'Demo Bike Driver',
        contactNumber: '',
        isAccessible: false,
        isReserved: false,
      });
    } else {
      setFormData({
        registrationNumber: `DEMO-CAR-${randomNum}`,
        vehicleType: 'Car',
        driverName: 'Demo Car Driver',
        contactNumber: '',
        isAccessible: false,
        isReserved: false,
      });
    }
    setError('');
  };

  return (
    <div className="bg-[#172033] rounded-xl border border-[#334155] p-6 shadow-xs max-w-3xl mx-auto text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC]">
            Inbound Vehicle Entry & Allocation
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Automatic nearest bay selection using custom Min-Heap spatial algorithm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#94A3B8]">Quick Presets:</span>
          <button
            type="button"
            onClick={() => fillSample('CAR')}
            className="text-[11px] px-2 py-1 bg-[#1E293B] hover:bg-[#334155] rounded text-[#F8FAFC] transition-colors"
          >
            + Standard Car
          </button>
          <button
            type="button"
            onClick={() => fillSample('ACCESSIBLE')}
            className="text-[11px] px-2 py-1 bg-[#1E3A5F] hover:bg-[#254B73] rounded text-[#BFDBFE] transition-colors"
          >
            + Accessible
          </button>
          <button
            type="button"
            onClick={() => fillSample('VIP')}
            className="text-[11px] px-2 py-1 bg-[#3A2D1A] hover:bg-[#4A391E] rounded text-amber-200 transition-colors"
          >
            + VIP Reserved
          </button>
        </div>
      </div>

      {/* Algorithmic Status Banner */}
      <div className="my-4 p-3 bg-[#1E293B] rounded-lg border border-[#334155] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#CBD5E1]">
          <Sparkles className="w-4 h-4 text-[#60A5FA]" />
          <span>Min-Heap Optimal Next Target:</span>
          {nearestCandidate ? (
            <span className="font-mono font-bold text-[#F8FAFC] bg-[#172033] px-2 py-0.5 rounded border border-[#334155]">
              Slot {nearestCandidate.id} ({nearestCandidate.distance}m from gate)
            </span>
          ) : (
            <span className="text-rose-300 font-medium">All compatible slots full</span>
          )}
        </div>
        <div className="text-[#94A3B8] font-mono text-[11px]">
          Available: {summaryMetrics.availableSlots} / {summaryMetrics.totalSlots}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-[#3B1D2A] border border-rose-500/40 rounded-lg flex items-center gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Queue Prompt if no slot available */}
      {queuePrompt && (
        <div className="mb-4 p-4 bg-[#3A2D1A] border border-amber-500/40 rounded-lg space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-amber-100">
            <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Facility at Capacity for Vehicle Category</div>
              <p className="mt-0.5 text-amber-200 leading-relaxed">
                {queuePrompt.message} Would you like to place vehicle{' '}
                <strong className="font-mono">{queuePrompt.vehicleData.registrationNumber}</strong> into
                the Circular Waiting Queue?
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-500/30">
            <button
              type="button"
              onClick={() => setQueuePrompt(null)}
              className="px-3 py-1.5 text-xs text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#1E293B] border border-[#334155] rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAcceptQueue}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Enqueue Vehicle (Position #{summaryMetrics.waitingVehicles + 1})
            </button>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Vehicle Plate & Vehicle Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
              Vehicle Registration Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. KA-05-MC-4412"
              className="w-full px-3 py-2 bg-[#1E293B] text-sm font-mono border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#60A5FA] uppercase transition-all"
            />
            <span className="text-[10px] text-[#94A3B8] mt-1 block">
              Indexed into Hash Table for instant O(1) retrieval
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
              Vehicle Classification <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'Car', icon: Car, label: 'Car / Sedan' },
                { type: 'SUV', icon: Truck, label: 'SUV / Van' },
                { type: 'Bike', icon: Bike, label: 'Motorbike' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = formData.vehicleType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, vehicleType: item.type }))}
                    className={`py-2 px-2.5 rounded-lg border text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? 'border-[#60A5FA] bg-[#1E3A5F] text-[#BFDBFE] font-semibold ring-1 ring-[#60A5FA]'
                        : 'border-[#334155] bg-[#1E293B] hover:border-[#60A5FA] text-[#CBD5E1]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Driver Name & Contact (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
              Driver / Owner Name (Optional)
            </label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-3 py-2 bg-[#1E293B] text-xs border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#60A5FA] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#CBD5E1] mb-1">
              Mobile Contact Number (Optional)
            </label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              placeholder="Optional contact details"
              className="w-full px-3 py-2 bg-[#1E293B] text-xs font-mono border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#60A5FA] transition-all"
            />
          </div>
        </div>

        {/* Row 3: Eligibility & Special Authorizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3.5 bg-[#1E293B] rounded-lg border border-[#334155]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAccessible"
              checked={formData.isAccessible}
              onChange={handleInputChange}
              className="mt-0.5 w-4 h-4 text-blue-500 rounded border-[#334155] focus:ring-[#60A5FA]"
            />
            <div>
              <div className="text-xs font-medium text-[#F8FAFC] flex items-center gap-1.5">
                <Accessibility className="w-3.5 h-3.5 text-[#60A5FA]" />
                Accessible Parking Eligibility
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Valid disability / mobility assistance permit. Allocates nearest bay in Row A or B.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isReserved"
              checked={formData.isReserved}
              onChange={handleInputChange}
              className="mt-0.5 w-4 h-4 text-amber-500 rounded border-[#334155] focus:ring-amber-400"
            />
            <div>
              <div className="text-xs font-medium text-[#F8FAFC] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Reserved / VIP Authorization
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Designated staff, tenant, or executive parking access.
              </p>
            </div>
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Automatic Entry Timestamp: Live</span>
          </div>
          <button
            type="submit"
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Allocate Optimal Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Ticket Modal popup */}
      <TicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        allocationData={successData}
      />
    </div>
  );
}
