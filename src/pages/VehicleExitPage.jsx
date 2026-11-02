import React from 'react';
import { LogOut, Info } from 'lucide-react';
import VehicleExitForm from '../components/forms/VehicleExitForm';

export default function VehicleExitPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <LogOut className="w-5 h-5 text-emerald-600" />
          Vehicle Exit & Fee Settlement
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Scan ticket or enter plate number • Calculate duration & rates • Release bay • Trigger automated waiting queue handoff
        </p>
      </div>

      <VehicleExitForm />

      {/* Educational DSA Context Note */}
      <div className="max-w-3xl mx-auto p-4 bg-[#172033] border border-[#334155] rounded-xl text-xs text-[#F8FAFC] space-y-1.5">
        <div className="font-semibold flex items-center gap-1.5 text-emerald-300">
          <Info className="w-4 h-4 text-emerald-400" />
          How Data Structures Power Vehicle Exit:
        </div>
        <p className="text-[#94A3B8] leading-relaxed">
          1. <strong>O(1) Plate Search</strong>: Vehicle record and entry timestamp are retrieved in constant time using our Hash Table with polynomial rolling hash.
        </p>
        <p className="text-[#94A3B8] leading-relaxed">
          2. <strong>Slot Release & Heap Restore</strong>: The freed slot is re-inserted into the Available Min-Heap with <em>O(log N)</em> heapify-up.
        </p>
        <p className="text-[#94A3B8] leading-relaxed">
          3. <strong>Automated Queue Handoff</strong>: If vehicles are waiting, the <strong>Circular Queue</strong> executes compatibility matching to allocate the bay to the earliest eligible driver without losing arrival order!
        </p>
      </div>
    </div>
  );
}
