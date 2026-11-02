import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  LogOut,
  Clock,
  Car,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Navigation,
  QrCode,
  DollarSign,
  User,
  Sparkles,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import {
  formatDateTime,
  formatDuration,
  getDurationMinutes,
  formatCurrency,
  normalizePlate,
} from '../../utils/formatters';
import { calculateParkingFee } from '../../utils/feeCalculator';
import ReceiptModal from '../common/ReceiptModal';

export default function VehicleExitForm() {
  const { vehicleHashTable, slots, processExit, settings } = useParking();
  const [searchParams] = useSearchParams();

  const [lookupPlate, setLookupPlate] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [hashMetrics, setHashMetrics] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR');
  const [error, setError] = useState('');
  const [exitResult, setExitResult] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Auto-populate from URL parameter if navigated from slot drawer or records
  useEffect(() => {
    const plateParam = searchParams.get('plate');
    if (plateParam) {
      setLookupPlate(plateParam);
      handleSearchPlate(plateParam);
    }
  }, [searchParams]);

  const handleSearchPlate = (plateToSearch) => {
    setError('');
    setSelectedVehicle(null);
    setHashMetrics(null);

    const plate = normalizePlate(plateToSearch || lookupPlate);
    if (!plate) {
      setError('Please provide a vehicle registration plate number.');
      return;
    }

    // O(1) Hash Table lookup
    const searchRes = vehicleHashTable.search(plate);
    if (searchRes && searchRes.found) {
      setSelectedVehicle(searchRes.value);
      setHashMetrics({
        probeSteps: searchRes.probeSteps,
        bucketIndex: searchRes.bucketIndex,
      });
    } else {
      setError(`No active parked vehicle found for plate "${plate}".`);
    }
  };

  const handleConfirmExit = (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const result = processExit(selectedVehicle.registrationNumber, paymentMethod);
    if (result.success) {
      setExitResult(result);
      setIsReceiptOpen(true);
      setSelectedVehicle(null);
      setLookupPlate('');
    } else {
      setError(result.error);
    }
  };

  // Get active parked vehicles for quick selection
  const activeParkedVehicles = slots
    .filter((s) => s.status === 'occupied' && s.vehicle)
    .map((s) => s.vehicle);

  // Live calculations for selected vehicle
  const durationMinutes = selectedVehicle ? getDurationMinutes(selectedVehicle.entryTime) : 0;
  const feeCalculation = selectedVehicle
    ? calculateParkingFee(selectedVehicle.vehicleType, durationMinutes, settings.rates)
    : null;

  return (
    <div className="bg-[#172033] rounded-xl border border-[#334155] p-6 shadow-xs max-w-3xl mx-auto text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-base font-semibold text-[#F8FAFC]">
            Outbound Vehicle Exit & Clearance
          </h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Instant Hash Table O(1) plate lookup and automated queue re-allocation engine
          </p>
        </div>
      </div>

      {/* Lookup Bar */}
      <div className="my-5">
        <label className="block text-xs font-medium text-[#CBD5E1] mb-1.5">
          Scan Barcode or Enter Registration Plate
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupPlate}
              onChange={(e) => setLookupPlate(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPlate()}
              placeholder="e.g. KA-05-MC-4412"
              className="w-full pl-9 pr-3 py-2 bg-[#1E293B] text-sm font-mono border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#60A5FA] uppercase transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearchPlate()}
            className="py-2 px-5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-xs rounded-lg transition-colors shadow-2xs"
          >
            Lookup Plate
          </button>
        </div>

        {/* Quick Pick Pills of currently active vehicles */}
        {activeParkedVehicles.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-[#94A3B8]">Active Bays:</span>
            {activeParkedVehicles.slice(0, 7).map((veh) => (
              <button
                key={veh.registrationNumber}
                type="button"
                onClick={() => {
                  setLookupPlate(veh.registrationNumber);
                  handleSearchPlate(veh.registrationNumber);
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B] hover:bg-[#1E3A5F] hover:text-[#BFDBFE] border border-[#334155] text-[#CBD5E1] transition-colors"
              >
                {veh.slotId}: {veh.registrationNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-4 p-3 bg-[#3B1D2A] border border-rose-500/40 rounded-lg flex items-center gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-300 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lookup Result Box */}
      {selectedVehicle && feeCalculation && (
        <div className="mt-6 border border-[#334155] rounded-xl overflow-hidden">
          {/* DSA Hash Telemetry Banner */}
          {hashMetrics && (
            <div className="bg-[#0B1120] text-[#F8FAFC] px-4 py-2 text-xs flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                Hash Table O(1) Match
              </span>
              <span className="text-[#94A3B8] text-[11px]">
                Bucket Index: #{hashMetrics.bucketIndex} • Linked List Probes: {hashMetrics.probeSteps}
              </span>
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                <div className="text-[11px] text-[#94A3B8] font-medium">Vehicle Registration</div>
                <div className="font-mono font-bold text-base text-[#F8FAFC] mt-0.5">
                  {selectedVehicle.registrationNumber}
                </div>
                <div className="text-[11px] text-[#CBD5E1] mt-1 flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  {selectedVehicle.vehicleType}
                </div>
              </div>

              <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                <div className="text-[11px] text-[#94A3B8] font-medium">Allocated Bay</div>
                <div className="font-mono font-bold text-base text-[#60A5FA] mt-0.5">
                  Slot {selectedVehicle.slotId}
                </div>
                <div className="text-[11px] text-[#CBD5E1] mt-1 flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#94A3B8]" />
                  {selectedVehicle.slotDistance || 20}m from gate
                </div>
              </div>

              <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                <div className="text-[11px] text-[#94A3B8] font-medium">Parking Duration</div>
                <div className="font-mono font-bold text-base text-amber-700 mt-0.5 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  {formatDuration(durationMinutes)}
                </div>
                <div className="text-[11px] text-[#CBD5E1] mt-1">
                  {durationMinutes} total minutes
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-4 bg-[#1E293B] rounded-lg border border-[#334155] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Entry Timestamp:</span>
                <span className="font-mono text-[#F8FAFC]">
                  {formatDateTime(selectedVehicle.entryTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Exit Clearance Timestamp:</span>
                <span className="font-mono text-[#F8FAFC]">
                  {formatDateTime(new Date().toISOString())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Billable Parking Time:</span>
                <span className="font-mono text-[#F8FAFC]">
                  {feeCalculation.billableHours} Hour(s) @ ${feeCalculation.hourlyRate.toFixed(2)}/hr
                </span>
              </div>
              {feeCalculation.isGracePeriod && (
                <div className="text-emerald-300 font-medium text-[11px]">
                  ✓ Qualified for 15-minute free grace period.
                </div>
              )}
              <div className="pt-2 border-t border-[#334155] flex justify-between items-center">
                <span className="font-semibold text-[#F8FAFC] text-sm">Total Parking Fee:</span>
                <span className="font-mono font-bold text-xl text-emerald-300">
                  {formatCurrency(feeCalculation.totalFee)}
                </span>
              </div>
            </div>

            {/* Payment Selection */}
            <div>
              <label className="block text-xs font-medium text-[#CBD5E1] mb-2">
                Settlement Payment Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['UPI / QR', 'Credit Card', 'Cash', 'Fastag Auto-Debit'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      paymentMethod === method
                        ? 'border-[#60A5FA] bg-[#1E3A5F] text-[#BFDBFE] ring-1 ring-[#60A5FA] font-semibold'
                        : 'border-[#334155] bg-[#1E293B] hover:border-[#60A5FA] text-[#CBD5E1]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="py-2 px-4 rounded-lg border border-[#334155] bg-[#1E293B] text-xs font-medium text-[#CBD5E1] hover:bg-[#334155] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="py-2.5 px-6 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-xs transition-colors flex items-center gap-2 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Payment & Release Slot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        exitData={exitResult}
      />
    </div>
  );
}
