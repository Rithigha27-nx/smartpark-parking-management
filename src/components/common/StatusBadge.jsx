import React from 'react';
import { CheckCircle2, Car, Accessibility, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function StatusBadge({ status, type, size = 'md' }) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm font-medium',
  };

  if (status === 'available') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Available
      </span>
    );
  }

  if (status === 'occupied') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses[size]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Occupied
      </span>
    );
  }

  if (status === 'maintenance') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses[size]}`}
      >
        <AlertTriangle className="w-3 h-3 text-slate-500" />
        Out of Service
      </span>
    );
  }

  // Category badges (when status is omitted or purely representing type)
  if (type === 'accessible') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
      >
        <Accessibility className="w-3 h-3 text-blue-600" />
        Accessible
      </span>
    );
  }

  if (type === 'reserved') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses[size]}`}
      >
        <ShieldCheck className="w-3 h-3 text-amber-600" />
        Reserved
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
    >
      <Car className="w-3 h-3 text-slate-500" />
      Standard
    </span>
  );
}
