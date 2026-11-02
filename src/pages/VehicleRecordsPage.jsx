import React from 'react';
import { FileSpreadsheet, Search } from 'lucide-react';
import SearchPanel from '../components/records/SearchPanel';
import TransactionTable from '../components/records/TransactionTable';

export default function VehicleRecordsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#334155]">
        <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#3B82F6]" />
          Vehicle Records & Transaction History
        </h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Unified vehicle registration lookup and permanent historical settlement ledger
        </p>
      </div>

      {/* Unified Search Panel */}
      <SearchPanel />

      {/* Historical Ledger Table with Custom Merge Sort */}
      <TransactionTable />
    </div>
  );
}
