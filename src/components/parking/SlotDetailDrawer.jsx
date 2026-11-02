import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Clock,
  Car,
  User,
  Phone,
  Navigation,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Accessibility,
  Shield,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import {
  formatDateTime,
  formatDuration,
  getDurationMinutes,
  formatCurrency,
  formatPlateDisplay,
} from '../../utils/formatters';
import { calculateParkingFee } from '../../utils/feeCalculator';
import StatusBadge from '../common/StatusBadge';

export default function SlotDetailDrawer({ slot, onClose }) {
  const { toggleSlotMaintenance, settings } = useParking();
  const navigate = useNavigate();

  if (!slot) return null;

  const durationMinutes = slot.vehicle ? getDurationMinutes(slot.vehicle.entryTime) : 0;
  const estimatedFee = slot.vehicle
    ? calculateParkingFee(slot.vehicle.vehicleType, durationMinutes, settings.rates).totalFee
    : 0;

  const handleCheckoutRedirect = () => {
    if (slot.vehicle) {
      navigate(`/exit?plate=${encodeURIComponent(slot.vehicle.registrationNumber)}`);
    }
  };

  const handleToggleService = () => {
    toggleSlotMaintenance(slot.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-900 text-white font-mono font-bold text-xl flex items-center justify-center">
            {slot.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-base">
                Slot Bay {slot.id}
              </h3>
              <StatusBadge status={slot.status} size="sm" />
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>Row {slot.row}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Navigation className="w-3 h-3 text-slate-400" />
                {slot.distance} meters from entrance
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="py-4 space-y-4 flex-1">
        {/* Slot Category Info */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Bay Category:</span>
            <div className="flex items-center gap-1 font-medium capitalize text-slate-800">
              {slot.type === 'accessible' && (
                <Accessibility className="w-3.5 h-3.5 text-blue-600" />
              )}
              {slot.type === 'reserved' && (
                <Shield className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>{slot.type} Parking</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Distance Metric:</span>
            <span className="font-mono text-slate-800 font-semibold">{slot.distance} meters</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Heap Priority Tier:</span>
            <span className="font-mono text-blue-600 font-medium">
              Tier {Math.ceil(slot.distance / 10)}
            </span>
          </div>
        </div>

        {/* Occupied Vehicle Details */}
        {slot.status === 'occupied' && slot.vehicle ? (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Assigned Vehicle Record
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Plate Number:</span>
                <span className="font-mono font-bold text-sm text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300">
                  {formatPlateDisplay(slot.vehicle.registrationNumber)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle Type:</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  {slot.vehicle.vehicleType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Driver Name:</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {slot.vehicle.driverName || 'Guest Visitor'}
                </span>
              </div>
              {slot.vehicle.contactNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-mono text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {slot.vehicle.contactNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Time and Duration Card */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Entry Timestamp:</span>
                <span className="font-mono text-slate-800">
                  {formatDateTime(slot.vehicle.entryTime)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Duration:</span>
                <span className="font-mono font-semibold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {formatDuration(durationMinutes)} ({durationMinutes} mins)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">Accumulated Fee:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {formatCurrency(estimatedFee)}
                </span>
              </div>
            </div>
          </div>
        ) : slot.status === 'maintenance' ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-600">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-800">Bay Under Maintenance</div>
            <p className="mt-1 text-slate-500">
              This bay is temporarily taken out of service for inspection or barrier repair.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg text-center text-xs text-emerald-800">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="font-semibold text-emerald-900">Ready for Immediate Allocation</div>
            <p className="mt-1 text-emerald-700">
              Min-Heap has indexed this slot at {slot.distance} meters from entrance gate.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-200 space-y-2">
        {slot.status === 'occupied' ? (
          <button
            onClick={handleCheckoutRedirect}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Direct Exit & Generate Receipt
          </button>
        ) : (
          <button
            onClick={handleToggleService}
            className={`w-full py-2.5 px-4 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border ${
              slot.status === 'maintenance'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {slot.status === 'maintenance'
              ? 'Restore to Available'
              : 'Mark as Out of Service'}
          </button>
        )}
      </div>
    </div>
  );
}
