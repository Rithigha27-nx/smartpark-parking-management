import React from 'react';
import { X, Printer, CheckCircle, Navigation, QrCode } from 'lucide-react';
import { formatDateTime, formatPlateDisplay, formatOperatorName } from '../../utils/formatters';
import { useParking } from '../../context/ParkingContext';

export default function TicketModal({ isOpen, onClose, allocationData }) {
  const { settings } = useParking();

  if (!isOpen || !allocationData) return null;

  const { slot, vehicle } = allocationData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-[#172033] text-[#F8FAFC] rounded-xl shadow-2xl border border-[#334155] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-200" />
            <h3 className="font-semibold text-sm">Parking Slot Allocated</h3>
          </div>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Card */}
        <div className="p-6 space-y-5 print-card">
          <div className="text-center pb-4 border-b border-dashed border-[#334155]">
            <div className="font-bold text-base text-[#F8FAFC] uppercase tracking-wider">
              {settings.facilityName}
            </div>
            <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Terminal Access Ticket • Code: {settings.facilityCode}
            </div>
          </div>

          {/* Large Slot Display */}
          <div className="bg-[#1E293B] border-2 border-dashed border-[#60A5FA] rounded-xl p-4 text-center">
            <div className="text-xs font-semibold text-[#60A5FA] uppercase tracking-widest">
              Allocated Bay
            </div>
            <div className="text-4xl font-extrabold text-[#F8FAFC] font-mono my-1 tracking-wider">
              {slot.id}
            </div>
            <div className="text-xs text-[#CBD5E1] flex items-center justify-center gap-1.5 font-medium">
              <Navigation className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Row {slot.row} • {slot.distance}m from North Gate</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs border-b border-dashed border-[#334155] pb-4">
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Registration Number:</span>
              <span className="font-mono font-bold text-[#F8FAFC]">{formatPlateDisplay(vehicle.registrationNumber)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Vehicle Type:</span>
              <span className="font-medium text-[#F8FAFC]">{vehicle.vehicleType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Bay Category:</span>
              <span className="font-medium capitalize text-[#F8FAFC]">{slot.type} Parking</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Entry Timestamp:</span>
              <span className="font-mono text-[#F8FAFC]">{formatDateTime(vehicle.entryTime)}</span>
            </div>
            {vehicle.driverName && (
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">Driver Name:</span>
                <span className="font-medium text-[#F8FAFC]">{vehicle.driverName}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Operator on Duty:</span>
              <span className="text-[#F8FAFC]">{formatOperatorName(settings.operatorName)}</span>
            </div>
          </div>

          {/* Barcode & Notice */}
          <div className="text-center pt-1 space-y-2">
            <div className="flex justify-center">
              {/* Simulated Authentic Barcode */}
              <div className="h-10 w-48 bg-slate-900 flex items-center justify-around px-2 rounded-xs">
                <span className="w-1 h-8 bg-white" />
                <span className="w-2 h-8 bg-white" />
                <span className="w-0.5 h-8 bg-white" />
                <span className="w-1.5 h-8 bg-white" />
                <span className="w-1 h-8 bg-white" />
                <span className="w-3 h-8 bg-white" />
                <span className="w-0.5 h-8 bg-white" />
                <span className="w-2 h-8 bg-white" />
                <span className="w-1 h-8 bg-white" />
                <span className="w-1.5 h-8 bg-white" />
              </div>
            </div>
            <p className="text-[10px] text-[#94A3B8]">
              Keep this ticket inside vehicle. Present barcode at Exit Gate 2.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#1E293B] px-6 py-3.5 border-t border-[#334155] flex items-center justify-end gap-3 no-print">
          <button
            onClick={handlePrint}
            className="py-2 px-4 rounded-lg border border-[#334155] text-xs font-medium text-[#CBD5E1] bg-[#172033] hover:bg-[#334155] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Entry Ticket
          </button>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
