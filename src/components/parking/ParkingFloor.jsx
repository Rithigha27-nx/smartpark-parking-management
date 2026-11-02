import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  Navigation,
  Filter,
  CheckCircle2,
  Accessibility,
  Shield,
  Layers,
  Car,
} from 'lucide-react';
import ParkingSlot from './ParkingSlot';
import SlotDetailDrawer from './SlotDetailDrawer';
import { useParking } from '../../context/ParkingContext';

export default function ParkingFloor({ onSlotSelect, selectedSlotId }) {
  const { slots } = useParking();
  const [activeSlot, setActiveSlot] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rowFilter, setRowFilter] = useState('ALL');

  // Filter slots
  const filteredSlots = slots.filter((slot) => {
    if (categoryFilter !== 'ALL' && slot.type !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'ALL' && slot.status !== statusFilter.toLowerCase()) {
      return false;
    }
    if (rowFilter !== 'ALL' && slot.row !== rowFilter) {
      return false;
    }
    return true;
  });

  const rowA = filteredSlots.filter((s) => s.row === 'A');
  const rowB = filteredSlots.filter((s) => s.row === 'B');
  const rowC = filteredSlots.filter((s) => s.row === 'C');

  const handleSlotClick = (slot) => {
    setActiveSlot(slot);
    if (onSlotSelect) onSlotSelect(slot);
  };

  // Keep active slot updated with latest state
  const currentActiveSlot = activeSlot
    ? slots.find((s) => s.id === activeSlot.id) || activeSlot
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Floor Plan Grid */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Main Facility Ground Deck (30 Bays)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top-down spatial view with entrance distance metrics and directional transit lanes
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="STANDARD">Standard</option>
              <option value="ACCESSIBLE">Accessible</option>
              <option value="RESERVED">Reserved</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Out of Service</option>
            </select>

            {/* Row Filter */}
            <select
              value={rowFilter}
              onChange={(e) => setRowFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Rows (A, B, C)</option>
              <option value="A">Row A Only</option>
              <option value="B">Row B Only</option>
              <option value="C">Row C Only</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="my-4 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-slate-700">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available (Vacant)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Accessible (ADA)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved (Permit)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Out of Service
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Allocation Algorithm: Min-Heap Distance
          </div>
        </div>

        {/* 2D Parking Deck Layout */}
        <div className="relative mt-4 p-4 bg-slate-100 rounded-xl border border-slate-300">
          {/* Top Entrance Banner */}
          <div className="flex items-center justify-between mb-3 px-3 py-1.5 bg-blue-700 text-white rounded-md text-xs font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-200" />
              <span>MAIN ENTRY GATE 1 (NORTH) — Min-Heap Origin Point [Distance: 0m]</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-blue-200 text-[11px]">
              <span>Inbound Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ROW A */}
          {(rowFilter === 'ALL' || rowFilter === 'A') && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs font-bold text-slate-700 tracking-wider">
                  ROW A (North Bay — Nearest to Entrance)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Bays A01 – A10 • Walking Distance: 10m–46m
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {rowA.map((slot) => (
                  <ParkingSlot
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlotId === slot.id || currentActiveSlot?.id === slot.id}
                    onClick={() => handleSlotClick(slot)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* DRIVING LANE 1 */}
          <div className="my-3 py-2 px-4 bg-slate-200/80 rounded border-y border-dashed border-slate-400 flex items-center justify-between text-[11px] font-mono text-slate-600 select-none">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              <span>DRIVING LANE 1 (ONE-WAY EASTBOUND)</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-slate-500 font-sans text-[10px]">Speed Limit: 10 km/h</span>
          </div>

          {/* ROW B */}
          {(rowFilter === 'ALL' || rowFilter === 'B') && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs font-bold text-slate-700 tracking-wider">
                  ROW B (Central Bay — Transit Aisle)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Bays B01 – B10 • Walking Distance: 20m–56m
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {rowB.map((slot) => (
                  <ParkingSlot
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlotId === slot.id || currentActiveSlot?.id === slot.id}
                    onClick={() => handleSlotClick(slot)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* DRIVING LANE 2 */}
          <div className="my-3 py-2 px-4 bg-slate-200/80 rounded border-y border-dashed border-slate-400 flex items-center justify-between text-[11px] font-mono text-slate-600 select-none">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              <span>DRIVING LANE 2 (ONE-WAY EASTBOUND)</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-slate-500 font-sans text-[10px]">Pedestrian Priority Zone</span>
          </div>

          {/* ROW C */}
          {(rowFilter === 'ALL' || rowFilter === 'C') && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs font-bold text-slate-700 tracking-wider">
                  ROW C (South Bay — Near Exit Concourse)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Bays C01 – C10 • Walking Distance: 32m–68m
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                {rowC.map((slot) => (
                  <ParkingSlot
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlotId === slot.id || currentActiveSlot?.id === slot.id}
                    onClick={() => handleSlotClick(slot)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom Exit Banner */}
          <div className="flex items-center justify-between mt-3 px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium tracking-wide">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>MAIN EXIT GATE 2 (SOUTH-EAST) — Automated Boom Barrier & Cashier</span>
            </div>
            <div className="font-mono text-slate-300 text-[11px]">Outbound Clearance Lane</div>
          </div>
        </div>
      </div>

      {/* Side Detail Panel (Sticky Drawer when slot is clicked) */}
      {currentActiveSlot && (
        <div className="w-full lg:w-80 flex-shrink-0">
          <SlotDetailDrawer
            slot={currentActiveSlot}
            onClose={() => setActiveSlot(null)}
          />
        </div>
      )}
    </div>
  );
}
