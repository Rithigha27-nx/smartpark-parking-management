import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Car,
  Clock,
  Navigation,
  DollarSign,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import {
  formatDateTime,
  formatDuration,
  getDurationMinutes,
  formatCurrency,
  normalizePlate,
} from '../../utils/formatters';
import { calculateParkingFee } from '../../utils/feeCalculator';

export default function SearchPanel() {
  const { vehicleHashTable, slots, waitingQueueItems, transactions, settings } = useParking();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const initial = searchParams.get('search');
    if (initial) {
      setQuery(initial);
      executeSearch(initial);
    }
  }, [searchParams]);

  const executeSearch = (plateQuery) => {
    const target = normalizePlate(plateQuery || query);
    setHasSearched(true);
    if (!target) {
      setResult(null);
      return;
    }

    // 1. Check actively parked vehicles using Hash Table
    const hashRes = vehicleHashTable.search(target);
    if (hashRes && hashRes.found) {
      const veh = hashRes.value;
      const duration = getDurationMinutes(veh.entryTime);
      const fee = calculateParkingFee(veh.vehicleType, duration, settings.rates).totalFee;
      setResult({
        found: true,
        status: 'PARKED',
        vehicle: veh,
        slotId: veh.slotId,
        entryTime: veh.entryTime,
        exitTime: null,
        durationMinutes: duration,
        fee: fee,
        dsaMethod: `Hash Table separate-chaining lookup (Bucket #${hashRes.bucketIndex}, ${hashRes.probeSteps} probe)`,
      });
      return;
    }

    // 2. Check waiting queue
    const queued = waitingQueueItems.find(
      (v) => normalizePlate(v.registrationNumber) === target
    );
    if (queued) {
      const waitMins = getDurationMinutes(queued.enqueuedAt);
      const pos = waitingQueueItems.findIndex(
        (v) => normalizePlate(v.registrationNumber) === target
      ) + 1;
      setResult({
        found: true,
        status: 'WAITING',
        vehicle: queued,
        slotId: null,
        queuePosition: pos,
        entryTime: queued.enqueuedAt,
        exitTime: null,
        durationMinutes: waitMins,
        fee: 0,
        dsaMethod: `Circular Queue traversal (FIFO Position #${pos})`,
      });
      return;
    }

    // 3. Check historical transactions
    const history = transactions.find(
      (t) => normalizePlate(t.registrationNumber) === target
    );
    if (history) {
      setResult({
        found: true,
        status: 'EXITED',
        vehicle: {
          registrationNumber: history.registrationNumber,
          vehicleType: history.vehicleType,
          driverName: history.driverName,
          contactNumber: history.contactNumber,
        },
        slotId: history.slotId,
        entryTime: history.entryTime,
        exitTime: history.exitTime,
        durationMinutes: history.durationMinutes,
        fee: history.fee,
        transactionId: history.id,
        dsaMethod: 'Transaction Archive Database Record',
      });
      return;
    }

    setResult({ found: false, query: target });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: query });
    executeSearch(query);
  };

  return (
    <div className="bg-[#172033] rounded-xl border border-[#334155] p-6 shadow-xs">
      <div className="pb-4 border-b border-[#334155]">
        <h3 className="text-base font-semibold text-[#F8FAFC]">
          Global Vehicle & Record Lookup
        </h3>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Unified query across Active Bay Hash Table, Circular Queue, and Historical Ledger
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="my-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search registration plate (e.g. KA-05-MC-4412)..."
            className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-[#1E293B] border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#60A5FA] uppercase transition-all"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium text-xs rounded-lg transition-colors shadow-2xs"
        >
          Search Vehicle
        </button>
      </form>

      {/* Result Display */}
      {hasSearched && (
        <div className="mt-4">
          {result && result.found ? (
            <div className="border border-[#334155] rounded-xl overflow-hidden bg-[#172033]">
              {/* Telemetry Header */}
              <div className="bg-[#0B1120] text-[#F8FAFC] px-4 py-2.5 text-xs flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Status: <strong>{result.status}</strong>
                </span>
                <span className="text-[#94A3B8] text-[11px]">{result.dsaMethod}</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]">
                  <div>
                    <span className="text-xs font-semibold text-[#94A3B8] uppercase">
                      Vehicle Registration Plate
                    </span>
                    <div className="font-mono font-bold text-xl text-[#F8FAFC] mt-0.5">
                      {result.vehicle.registrationNumber}
                    </div>
                  </div>
                  <div>
                    {result.status === 'PARKED' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#17352C] text-emerald-200 border border-emerald-500/30">
                        Currently Parked in Slot {result.slotId}
                      </span>
                    )}
                    {result.status === 'WAITING' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3A2D1A] text-amber-200 border border-amber-500/30">
                        In Waiting Queue (Position #{result.queuePosition})
                      </span>
                    )}
                    {result.status === 'EXITED' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1E293B] text-[#CBD5E1] border border-[#334155]">
                        Exited Facility ({result.transactionId})
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <span className="text-[#94A3B8]">Classification:</span>
                    <div className="font-semibold text-[#F8FAFC] mt-1">
                      {result.vehicle.vehicleType}
                    </div>
                  </div>
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <span className="text-[#94A3B8]">Allocated Bay:</span>
                    <div className="font-mono font-bold text-[#60A5FA] mt-1">
                      {result.slotId || 'Holding Area'}
                    </div>
                  </div>
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <span className="text-[#94A3B8]">Duration:</span>
                    <div className="font-mono font-semibold text-[#FBBF24] mt-1">
                      {formatDuration(result.durationMinutes)}
                    </div>
                  </div>
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <span className="text-[#94A3B8]">Parking Fee:</span>
                    <div className="font-mono font-bold text-[#34D399] mt-1">
                      {formatCurrency(result.fee)}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#CBD5E1] bg-[#1E293B] p-3 rounded-lg border border-[#334155]">
                  <div className="flex justify-between">
                    <span>Entry Timestamp:</span>
                    <span className="font-mono text-[#F8FAFC] font-medium">
                      {formatDateTime(result.entryTime)}
                    </span>
                  </div>
                  {result.exitTime && (
                    <div className="flex justify-between">
                      <span>Exit Timestamp:</span>
                      <span className="font-mono text-[#F8FAFC] font-medium">
                        {formatDateTime(result.exitTime)}
                      </span>
                    </div>
                  )}
                  {result.vehicle.driverName && (
                    <div className="flex justify-between">
                      <span>Driver / Customer:</span>
                      <span className="text-[#F8FAFC] font-medium">
                        {result.vehicle.driverName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Action */}
                {result.status === 'PARKED' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        navigate(`/exit?plate=${encodeURIComponent(result.vehicle.registrationNumber)}`)
                      }
                      className="py-2 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                    >
                      Proceed to Checkout Exit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#94A3B8] text-xs bg-[#1E293B] rounded-xl border border-[#334155]">
              <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
              <div className="font-semibold text-[#F8FAFC]">No Vehicle Records Found</div>
              <p className="mt-1 text-[#94A3B8]">
                No active parking, waiting queue, or transaction record matches plate &ldquo;
                {result?.query}&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
