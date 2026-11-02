import React from 'react';
import {
  ListOrdered,
  Clock,
  Car,
  Trash2,
  CheckCircle,
  Accessibility,
  Shield,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import {
  formatPlateDisplay,
  formatDateTime,
  formatDuration,
  getDurationMinutes,
} from '../../utils/formatters';

export default function QueueTable({ onManualAdmit }) {
  const { waitingQueueItems, removeFromWaitingQueue, settings, summaryMetrics } = useParking();

  return (
    <div className="bg-[#172033] rounded-xl border border-[#334155] overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-[#FBBF24]" />
            Active Circular Waiting Queue Buffer
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Strict FIFO queue with compatibility-aware slot matching without relative order loss
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-[#3A2D1A] text-[#FBBF24] border border-amber-500/30">
            Buffer: {waitingQueueItems.length} / {settings.queueCapacity || 15} vehicles
          </span>
        </div>
      </div>

      {/* Table Body */}
      {waitingQueueItems.length === 0 ? (
        <div className="p-12 text-center text-[#94A3B8]">
          <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
            <CheckCircle className="w-6 h-6 text-[#34D399]" />
          </div>
          <div className="font-medium text-[#F8FAFC] text-sm">Waiting Queue is Clear</div>
          <p className="text-xs text-[#94A3B8] mt-1">
            No vehicles currently holding. All inbound traffic is allocated immediately.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#202D42] border-b border-[#334155] text-[#CBD5E1] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Plate Number</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Special Eligibility</th>
                <th className="py-3 px-4">Driver / Contact</th>
                <th className="py-3 px-4">Arrival Time</th>
                <th className="py-3 px-4">Wait Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {waitingQueueItems.map((item, index) => {
                const waitMinutes = getDurationMinutes(item.enqueuedAt);
                return (
                  <tr key={item.registrationNumber} className="odd:bg-[#172033] even:bg-[#1B2639] hover:bg-[#263449] transition-colors">
                    {/* Position */}
                    <td className="py-3 px-4 font-mono font-bold text-[#F8FAFC]">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          index === 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                            : 'bg-[#1E293B] text-[#CBD5E1]'
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>

                    {/* Plate */}
                    <td className="py-3 px-4 font-mono font-bold text-[#F8FAFC] text-sm">
                      {formatPlateDisplay(item.registrationNumber)}
                    </td>

                    {/* Vehicle Type */}
                    <td className="py-3 px-4 font-medium text-[#CBD5E1]">
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {item.vehicleType}
                      </span>
                    </td>

                    {/* Eligibility */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.isAccessible && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#1E3A5F] text-blue-200 border border-blue-500/30 font-medium">
                            <Accessibility className="w-3 h-3 text-blue-300" />
                            Accessible
                          </span>
                        )}
                        {item.isReserved && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#3A2D1A] text-amber-200 border border-amber-500/30 font-medium">
                            <Shield className="w-3 h-3 text-amber-300" />
                            Reserved
                          </span>
                        )}
                        {!item.isAccessible && !item.isReserved && (
                          <span className="text-[#94A3B8] text-[11px]">Standard</span>
                        )}
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-3 px-4 text-[#CBD5E1]">
                      <div>{item.driverName || 'Guest'}</div>
                      {item.contactNumber && (
                        <div className="text-[11px] text-[#94A3B8] font-mono">
                          {item.contactNumber}
                        </div>
                      )}
                    </td>

                    {/* Arrival Timestamp */}
                    <td className="py-3 px-4 font-mono text-[#CBD5E1]">
                      {formatDateTime(item.enqueuedAt)}
                    </td>

                    {/* Duration Waiting */}
                    <td className="py-3 px-4 font-mono font-semibold text-[#FBBF24]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                        {formatDuration(waitMinutes)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {summaryMetrics.availableSlots > 0 && onManualAdmit && (
                          <button
                            onClick={() => onManualAdmit(item)}
                            className="p-1.5 text-[#34D399] hover:text-emerald-200 hover:bg-[#17352C] rounded transition-colors"
                            title="Manually Admit to Available Bay"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFromWaitingQueue(item.registrationNumber)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#FB7185] hover:bg-[#351D2A] rounded transition-colors"
                          title="Cancel and remove from waiting queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
