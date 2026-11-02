import React from 'react';
import { LogIn, Info } from 'lucide-react';
import VehicleEntryForm from '../components/forms/VehicleEntryForm';

export default function VehicleEntryPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <LogIn className="w-5 h-5 text-blue-600" />
          Vehicle Registration & Bay Allocation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step 1: Check plate uniqueness • Step 2: Query Min-Heap for nearest available bay • Step 3: Issue entry ticket
        </p>
      </div>

      <VehicleEntryForm />

      {/* Educational DSA Context Note */}
      <div className="max-w-3xl mx-auto p-4 bg-[#172033] border border-[#334155] rounded-xl text-xs text-[#F8FAFC] space-y-1.5">
        <div className="font-semibold flex items-center gap-1.5 text-[#BFDBFE]">
          <Info className="w-4 h-4 text-[#60A5FA]" />
          How Data Structures Power Vehicle Entry:
        </div>
        <p className="text-[#94A3B8] leading-relaxed">
          1. <strong>Duplicate Plate Check</strong>: The system performs an <em>O(1)</em> lookup on the custom Separate Chaining Hash Table.
          If the vehicle is already parked or queued, registration is prevented with an instant error message.
        </p>
        <p className="text-[#94A3B8] leading-relaxed">
          2. <strong>Nearest Slot Assignment</strong>: Instead of a linear scan <em>O(N)</em>, candidate bays are organized in a <strong>Min-Heap</strong>
          ordered by physical distance from Gate 1. The top slot is extracted in <em>O(log N)</em> time.
        </p>
        <p className="text-[#94A3B8] leading-relaxed">
          3. <strong>Holding Buffer</strong>: If no compatible slot exists, the vehicle is safely placed into the fixed-size <strong>Circular Queue</strong> without delaying other drivers.
        </p>
      </div>
    </div>
  );
}
