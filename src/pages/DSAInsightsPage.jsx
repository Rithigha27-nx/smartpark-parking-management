import React from 'react';
import { Cpu, Binary, Layers, GitBranch, ShieldCheck } from 'lucide-react';
import DSAPerformancePanel from '../components/analytics/DSAPerformancePanel';

export default function DSAInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#334155] gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#3B82F6]" />
            DSA Core Engine Insights & Algorithm Visualizations
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Academic Data Structures & Algorithms verification suite • Min-Heap, Circular Queue, and Hash Table
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#1E293B] text-[#3B82F6] border border-[#334155]">
            Simulation Mode: Client Java-DSA Spec
          </span>
        </div>
      </div>

      {/* Main Algorithm Visualizations Panel */}
      <DSAPerformancePanel />
    </div>
  );
}
