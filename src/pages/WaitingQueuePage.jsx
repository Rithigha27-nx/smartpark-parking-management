import React, { useState } from 'react';
import {
  ListOrdered,
  Plus,
  Clock,
  Car,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { getDurationMinutes, formatDuration } from '../utils/formatters';
import QueueTable from '../components/queue/QueueTable';

export default function WaitingQueuePage() {
  const {
    waitingQueueItems,
    addToWaitingQueue,
    allocateVehicle,
    removeFromWaitingQueue,
    summaryMetrics,
    settings,
    addNotification,
  } = useParking();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    vehicleType: 'Car',
    driverName: '',
    contactNumber: '',
    isAccessible: false,
    isReserved: false,
  });
  const [error, setError] = useState('');

  // Calculate average wait time
  const avgWaitMinutes =
    waitingQueueItems.length > 0
      ? Math.round(
          waitingQueueItems.reduce(
            (sum, item) => sum + getDurationMinutes(item.enqueuedAt),
            0
          ) / waitingQueueItems.length
        )
      : 0;

  const handleManualAdd = (e) => {
    e.preventDefault();
    setError('');

    const res = addToWaitingQueue(formData);
    if (res.success) {
      setShowAddForm(false);
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

  const handleManualAdmit = (queueItem) => {
    const res = allocateVehicle({
      registrationNumber: queueItem.registrationNumber,
      vehicleType: queueItem.vehicleType,
      driverName: queueItem.driverName,
      contactNumber: queueItem.contactNumber,
      isAccessible: queueItem.isAccessible,
      isReserved: queueItem.isReserved,
      fromQueue: true,
    });

    if (res.success) {
      removeFromWaitingQueue(queueItem.registrationNumber);
    } else {
      addNotification(res.error, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#334155] gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <ListOrdered className="w-5 h-5 text-[#FBBF24]" />
            Waiting Queue & Congestion Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Fixed-capacity Circular FIFO Buffer • Compatibility-aware slot allocation engine
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-3.5 bg-[#FBBF24] hover:bg-amber-400 text-[#172033] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Enqueue Vehicle Manually'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#172033] rounded-xl border border-[#334155] shadow-xs">
          <span className="text-xs font-medium text-[#94A3B8] uppercase">Queue Depth</span>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1">
            {waitingQueueItems.length}{' '}
            <span className="text-xs font-normal text-[#94A3B8]">/ {settings.queueCapacity || 15} max</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Circular Array Buffer Capacity</div>
        </div>

        <div className="p-4 bg-[#172033] rounded-xl border border-[#334155] shadow-xs">
          <span className="text-xs font-medium text-[#94A3B8] uppercase">Average Wait Time</span>
          <div className="text-2xl font-bold text-[#FBBF24] font-mono mt-1">
            {formatDuration(avgWaitMinutes)}
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Across all holding vehicles</div>
        </div>

        <div className="p-4 bg-[#172033] rounded-xl border border-[#334155] shadow-xs">
          <span className="text-xs font-medium text-[#94A3B8] uppercase">Vacancy Status</span>
          <div className="text-2xl font-bold text-[#34D399] font-mono mt-1">
            {summaryMetrics.availableSlots} Bays
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Available for immediate match</div>
        </div>

        <div className="p-4 bg-[#172033] rounded-xl border border-[#334155] shadow-xs">
          <span className="text-xs font-medium text-[#94A3B8] uppercase">Algorithm Mode</span>
          <div className="text-sm font-bold text-[#60A5FA] mt-2 font-mono">
            Compatibility FIFO
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">Anti Head-of-Line Blocking</div>
        </div>
      </div>

      {/* Collapsible Manual Enqueue Form */}
      {showAddForm && (
        <div className="bg-[#172033] text-[#F8FAFC] rounded-xl border border-[#334155] p-5 shadow-sm space-y-4 max-w-2xl animate-in fade-in duration-150">
          <div className="font-semibold text-sm text-[#F8FAFC] pb-2 border-b border-[#334155]">
            Enqueue Vehicle into Waiting Line
          </div>

          {error && (
            <div className="p-2.5 bg-[#351D2A] border border-rose-500/40 rounded text-xs text-rose-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#CBD5E1] mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))
                  }
                  placeholder="e.g. MH-02-AB-9911"
                  className="w-full px-3 py-1.5 font-mono uppercase bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] border border-[#334155] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#CBD5E1] mb-1">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vehicleType: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 bg-[#1E293B] text-[#F8FAFC] border border-[#334155] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                >
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-[#CBD5E1] mb-1">Driver Name</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, driverName: e.target.value }))
                  }
                  placeholder="Demo Driver"
                  className="w-full px-3 py-1.5 bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] border border-[#334155] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#CBD5E1] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactNumber: e.target.value }))
                  }
                  placeholder="Optional contact details"
                  className="w-full px-3 py-1.5 font-mono bg-[#1E293B] text-[#F8FAFC] placeholder-[#94A3B8] border border-[#334155] rounded-md focus:outline-none focus:ring-1 focus:ring-[#FBBF24] focus:border-[#FBBF24]"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAccessible}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isAccessible: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-500 rounded border-[#334155] focus:ring-[#3B82F6]"
                />
                <span>Requires Accessible Bay</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isReserved}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isReserved: e.target.checked }))
                  }
                  className="w-4 h-4 text-amber-400 rounded border-[#334155] focus:ring-[#FBBF24]"
                />
                <span>Reserved / VIP Permit</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-1.5 px-3 bg-[#1E293B] text-[#CBD5E1] border border-[#334155] rounded-md hover:bg-[#334155]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-[#FBBF24] hover:bg-amber-400 text-[#172033] font-medium rounded-md"
              >
                Enqueue Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Queue Table */}
      <QueueTable onManualAdmit={handleManualAdmit} />

      {/* Circular FIFO Diagram & Technical Note */}
      <div className="p-4 bg-[#172033] border border-[#334155] rounded-xl shadow-xs text-xs space-y-2">
        <div className="font-semibold text-[#F8FAFC] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#3B82F6]" />
          DSA Circular Buffer & Order Invariant Logic:
        </div>
        <p className="text-[#CBD5E1] leading-relaxed">
          Standard FIFO queues suffer from <strong>Head-of-Line (HoL) Blocking</strong> when the vehicle at position #1 cannot use a newly freed slot
          (e.g., standard sedan cannot occupy a designated accessible bay, or vice-versa). Our custom <code>CircularQueue</code> implementation solves this
          by performing a circular scan with <code>dequeueFirstEligible()</code>:
        </p>
        <div className="p-3 bg-[#1E293B] border border-[#334155] rounded-lg font-mono text-[11px] text-[#CBD5E1]">
          <div>// Circular buffer pointer state:</div>
          <div>front = 0, rear = {waitingQueueItems.length - 1}, capacity = {settings.queueCapacity || 15}</div>
          <div>Enqueuing index: rear = (rear + 1) % capacity [O(1)]</div>
          <div>Dequeuing index: front = (front + 1) % capacity [O(1)]</div>
        </div>
      </div>
    </div>
  );
}
