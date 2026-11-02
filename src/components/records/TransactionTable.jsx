import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  ArrowUpDown,
  Download,
  Filter,
  Search,
  Clock,
  DollarSign,
  Car,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { MergeSort } from '../../dsa/MergeSort';
import {
  formatDateTime,
  formatDuration,
  formatCurrency,
} from '../../utils/formatters';

export default function TransactionTable() {
  const { transactions } = useParking();

  const [filterType, setFilterType] = useState('ALL');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortField, setSortField] = useState('exitTime'); // exitTime, durationMinutes, fee, registrationNumber
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'

  // Filter items
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== 'ALL' && t.vehicleType !== filterType) {
        return false;
      }
      if (
        filterQuery &&
        !t.registrationNumber.toLowerCase().includes(filterQuery.toLowerCase()) &&
        !t.slotId.toLowerCase().includes(filterQuery.toLowerCase()) &&
        !t.id.toLowerCase().includes(filterQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [transactions, filterType, filterQuery]);

  // Stable Sort using custom MergeSort implementation!
  const { sortedData, metrics } = useMemo(() => {
    const compareFn = (a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'exitTime' || sortField === 'entryTime') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    };

    const sortResult = MergeSort.sortWithMetrics(filtered, compareFn);
    return {
      sortedData: sortResult.sorted,
      metrics: {
        comparisons: sortResult.comparisons,
        executionTimeMs: sortResult.executionTimeMs,
      },
    };
  }, [filtered, sortField, sortDirection]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportCSV = () => {
    const headers = [
      'Transaction ID',
      'Vehicle Number',
      'Type',
      'Bay ID',
      'Entry Time',
      'Exit Time',
      'Duration (Mins)',
      'Fee ($)',
      'Payment Method',
      'Operator',
    ];

    const rows = sortedData.map((t) => [
      t.id,
      t.registrationNumber,
      t.vehicleType,
      t.slotId,
      t.entryTime,
      t.exitTime,
      t.durationMinutes,
      t.fee,
      t.paymentMethod,
      t.operator,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartpark_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#172033] rounded-xl border border-[#334155] overflow-hidden shadow-xs">
      {/* Table Bar */}
      <div className="p-4 border-b border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
            Completed Transaction Ledger
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Historical settlement records ordered via custom Merge Sort O(N log N) algorithm
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter plate or slot..."
              className="pl-8 pr-3 py-1.5 text-xs bg-[#1E293B] border border-[#334155] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#60A5FA] font-mono"
            />
          </div>

          {/* Vehicle Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs py-1.5 px-2.5 bg-[#1E293B] border border-[#334155] rounded-md text-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#60A5FA]"
          >
            <option value="ALL">All Types</option>
            <option value="Car">Car</option>
            <option value="SUV">SUV</option>
            <option value="Bike">Bike</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="py-1.5 px-3 rounded-md border border-[#334155] text-xs font-medium text-[#CBD5E1] bg-[#1E293B] hover:bg-[#334155] flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#94A3B8]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* DSA Telemetry bar */}
      <div className="px-4 py-2 bg-[#202D42] border-b border-[#334155] flex items-center justify-between text-[11px] font-mono text-[#CBD5E1]">
        <div className="flex items-center gap-3">
          <span>Sort Key: <strong>{sortField}</strong> ({sortDirection.toUpperCase()})</span>
          <span>•</span>
          <span>Merge Sort Comparisons: <strong className="text-[#60A5FA]">{metrics.comparisons}</strong></span>
        </div>
        <div>Execution Time: {metrics.executionTimeMs}ms</div>
      </div>

      {/* Table */}
      {sortedData.length === 0 ? (
        <div className="p-8 text-center text-[#94A3B8] text-xs">
          No transaction records match the specified filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#202D42] border-b border-[#334155] text-[#CBD5E1] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Txn ID</th>
                <th
                  onClick={() => toggleSort('registrationNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F8FAFC] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Vehicle Plate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Slot</th>
                <th
                  onClick={() => toggleSort('entryTime')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F8FAFC] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Entry Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('exitTime')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F8FAFC] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Exit Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('durationMinutes')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F8FAFC] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Duration</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('fee')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F8FAFC] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Fee</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {sortedData.map((t) => (
                <tr key={t.id} className="odd:bg-[#172033] even:bg-[#1B2639] hover:bg-[#263449] transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-[#94A3B8]">
                    {t.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#F8FAFC]">
                    {t.registrationNumber}
                  </td>
                  <td className="py-3 px-4 text-[#CBD5E1]">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3 text-[#94A3B8]" />
                      {t.vehicleType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#60A5FA]">
                    {t.slotId}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#CBD5E1]">
                    {formatDateTime(t.entryTime)}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#CBD5E1]">
                    {formatDateTime(t.exitTime)}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#F8FAFC]">
                    {formatDuration(t.durationMinutes)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#34D399]">
                    {formatCurrency(t.fee)}
                  </td>
                  <td className="py-3 px-4 text-[#CBD5E1]">
                    <span className="px-2 py-0.5 rounded bg-[#1E293B] text-[10px] font-medium text-[#CBD5E1] border border-[#334155]">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#94A3B8]">
                    {t.operator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
