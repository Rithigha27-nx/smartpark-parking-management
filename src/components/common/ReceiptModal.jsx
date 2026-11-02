import React from 'react';
import { X, Printer, CheckCircle, Car, Clock, CreditCard, Sparkles } from 'lucide-react';
import { formatDateTime, formatDuration, formatCurrency } from '../../utils/formatters';
import { useParking } from '../../context/ParkingContext';

export default function ReceiptModal({ isOpen, onClose, exitData }) {
  const { settings } = useParking();

  if (!isOpen || !exitData) return null;

  const { transaction, feeBreakdown, slotId, autoAllocatedVehicle } = exitData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="bg-[#172033] text-[#F8FAFC] rounded-xl shadow-2xl border border-[#334155] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-semibold text-sm">Vehicle Checkout Completed</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-Allocation Notice if applicable */}
        {autoAllocatedVehicle && (
          <div className="mx-6 mt-4 p-3 bg-[#1E3A5F] border border-blue-500/40 rounded-lg flex items-start gap-2.5 text-xs text-blue-100 no-print">
            <Sparkles className="w-4 h-4 text-[#60A5FA] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Queue Optimization Triggered:</span> Freed Bay{' '}
              <strong className="font-mono">{slotId}</strong> was automatically allocated to waiting
              vehicle <strong className="font-mono">{autoAllocatedVehicle.registrationNumber}</strong>.
            </div>
          </div>
        )}

        {/* Printable Receipt Card */}
        <div className="p-6 space-y-4 print-card">
          <div className="text-center pb-3 border-b border-dashed border-[#334155]">
            <div className="font-bold text-base text-[#F8FAFC] uppercase tracking-wider">
              {settings.facilityName}
            </div>
            <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
              Official Parking Receipt • Invoice #{transaction.id}
            </div>
          </div>

          {/* Vehicle and Slot Banner */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#94A3B8] font-medium">Vehicle Registration</div>
              <div className="font-mono font-bold text-base text-[#F8FAFC]">
                {transaction.registrationNumber}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#94A3B8] font-medium">Bay Cleared</div>
              <div className="font-mono font-bold text-base text-[#60A5FA]">
                {transaction.slotId}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 text-xs border-b border-dashed border-[#334155] pb-3">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Vehicle Type:</span>
              <span className="font-medium text-[#F8FAFC]">{transaction.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Entry Timestamp:</span>
              <span className="font-mono text-[#F8FAFC]">{formatDateTime(transaction.entryTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Exit Timestamp:</span>
              <span className="font-mono text-[#F8FAFC]">{formatDateTime(transaction.exitTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Total Duration:</span>
              <span className="font-mono font-semibold text-[#F8FAFC]">
                {formatDuration(transaction.durationMinutes)} ({transaction.durationMinutes} mins)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Billable Hours:</span>
              <span className="font-mono text-[#F8FAFC]">
                {feeBreakdown ? feeBreakdown.billableHours : Math.ceil(transaction.durationMinutes / 60)} hr(s)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Hourly Rate Applied:</span>
              <span className="font-mono text-[#F8FAFC]">
                ${feeBreakdown ? feeBreakdown.hourlyRate.toFixed(2) : '3.00'}/hr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Payment Channel:</span>
              <span className="font-medium text-[#F8FAFC]">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Cashier / Controller:</span>
              <span className="text-[#F8FAFC]">{transaction.operator}</span>
            </div>
          </div>

          {/* Total Fee Box */}
          <div className="bg-[#17352C] border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wide">
              Total Amount Paid
            </span>
            <span className="font-mono font-bold text-xl text-emerald-300">
              {formatCurrency(transaction.fee)}
            </span>
          </div>

          <div className="text-center text-[10px] text-[#94A3B8]">
            Thank you for parking with SmartPark. Automated gate barrier has been unlocked.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-[#1E293B] px-6 py-3.5 border-t border-[#334155] flex items-center justify-end gap-3 no-print">
          <button
            onClick={handlePrint}
            className="py-2 px-4 rounded-lg border border-[#334155] text-xs font-medium text-[#CBD5E1] bg-[#172033] hover:bg-[#334155] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-medium text-white transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
