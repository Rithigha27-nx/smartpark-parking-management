import React from 'react';
import { Accessibility, Shield, AlertTriangle, Clock } from 'lucide-react';
import { getDurationMinutes, formatDuration, formatPlateDisplay } from '../../utils/formatters';

export default function ParkingSlot({ slot, isSelected, onClick }) {
  const { id, type, status, distance, vehicle } = slot;

  // Calculate live duration if occupied
  const durationMinutes = vehicle ? getDurationMinutes(vehicle.entryTime) : 0;

  // Styling based on status and category
  let borderClasses = 'border-[#334155] hover:border-[#3B82F6] bg-[#172033]';
  let statusBadge = (
    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono">
      AVAILABLE
    </span>
  );

  if (status === 'occupied') {
    borderClasses = 'border-[#FB7185] bg-[#351D2A] hover:border-[#FB7185]';
    statusBadge = (
      <span className="text-[10px] font-semibold text-[#FFE4E6] bg-[#7F1D1D] px-1.5 py-0.5 rounded border border-[#FB7185] font-mono">
        OCCUPIED
      </span>
    );
  } else if (status === 'maintenance') {
    borderClasses = 'border-slate-600 bg-slate-800/40 hover:border-slate-500 opacity-70';
    statusBadge = (
      <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/30 px-1.5 py-0.5 rounded border border-slate-600 flex items-center gap-1 font-mono">
        <AlertTriangle className="w-2.5 h-2.5 text-slate-400" />
        SERVICE
      </span>
    );
  }

  // Type Indicator (Category preservation even if occupied!)
  const categoryIndicator = (
    <div className="flex items-center gap-1">
      {type === 'accessible' && (
        <span
          className="p-1 rounded bg-blue-500/20 text-[#60A5FA] border border-blue-500/30"
          title="Accessible Parking"
        >
          <Accessibility className="w-3.5 h-3.5" />
        </span>
      )}
      {type === 'reserved' && (
        <span
          className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30"
          title="Reserved / VIP Parking"
        >
          <Shield className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3 flex flex-col justify-between transition-all duration-150 cursor-pointer ${borderClasses} ${
        isSelected ? 'ring-2 ring-[#3B82F6] border-[#3B82F6]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold font-mono tracking-tight ${status === 'occupied' ? 'text-white' : 'text-[#F8FAFC]'}`}>
          {id}
        </span>
        {categoryIndicator}
      </div>

      <div className="my-2">
        {status === 'occupied' && vehicle ? (
          <div>
            <div className="font-mono font-bold text-xs text-[#F8FAFC] truncate">
              {formatPlateDisplay(vehicle.registrationNumber)}
            </div>
            <div className={`text-[10px] truncate mt-0.5 ${status === 'occupied' ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'}`}>
              {vehicle.vehicleType} • {vehicle.driverName || 'Visitor'}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[#64748B] font-mono">
            {distance}m from gate
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-[#334155]/60 flex items-center justify-between text-[10px]">
        {statusBadge}
        {status === 'occupied' && (
          <span className={`${status === 'occupied' ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'} flex items-center gap-1 font-mono`}>
            <Clock className="w-2.5 h-2.5 text-[#3B82F6]" />
            {formatDuration(durationMinutes)}
          </span>
        )}
      </div>
    </div>
  );
}
