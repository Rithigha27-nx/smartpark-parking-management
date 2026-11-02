import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid3X3,
  Car,
  CheckCircle2,
  ListOrdered,
  LogIn,
  LogOut,
  IndianRupee,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { formatCurrency, formatDateTime, formatPlateDisplay } from '../utils/formatters';
import SummaryCard from '../components/common/SummaryCard';
import ParkingSlot from '../components/parking/ParkingSlot';
import OccupancyChart from '../components/analytics/OccupancyChart';
import heroCarImage from '../assets/silver-suv.png';

export default function DashboardPage() {
  const { summaryMetrics, slots, waitingQueueItems, recentActivities, settings } = useParking();
  const navigate = useNavigate();

  // Preview Row A (first 10 bays) for the compact visual overview
  const rowASlots = slots.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* ========================================================
          A. WELCOME HERO SECTION (WITH AUTOMOTIVE VISUAL)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172033] via-[#172033] to-[#1E293B] border border-[#334155] shadow-xl p-6 sm:p-8">
        {/* Subtle automotive ambient glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-80 h-32 bg-[#3B82F6]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text & Quick Actions */}
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1E293B] text-[#60A5FA] border border-[#334155]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>{settings.facilityName}</span>
              <span className="text-[#64748B]">•</span>
              <span className="font-mono">{settings.facilityCode}</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                Welcome to SmartPark
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] mt-1.5 leading-relaxed">
                Here's your parking facility overview for today.
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[#60A5FA]">
                  Sample data
                </span>
              </p>
            </div>

            {/* Quick Actions (Distinguishable Primary & Secondary Buttons) */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/entry')}
                className="py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 shadow-md shadow-blue-500/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Register Vehicle</span>
              </button>

              <button
                onClick={() => navigate('/exit')}
                className="py-2.5 px-4 bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC] border border-[#334155] rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 active:scale-95"
              >
                <LogOut className="w-4 h-4 text-[#EF4444]" />
                <span>Process Exit</span>
              </button>

              <button
                onClick={() => navigate('/layout')}
                className="py-2.5 px-4 bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155] rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-150 active:scale-95"
              >
                <Layers className="w-4 h-4 text-[#3B82F6]" />
                <span>View Parking Facility</span>
              </button>
            </div>
          </div>

          {/* Right Realistic Dark Automotive Car Visual */}
          <div className="relative lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="relative group max-w-md w-full">
              {/* Floor shadow & reflection plane */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/60 rounded-full blur-md" />
              <img
                src={heroCarImage}
                alt="SmartPark Automotive"
                className="relative z-10 w-full max-h-56 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          B. FOUR MAIN KPI CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Parking Slots"
          value={summaryMetrics.totalSlots}
          subtitle="A01 – C10 Capacity"
          icon={Grid3X3}
          accentColor="blue"
          badgeText="Facility Deck"
          badgeType="neutral"
        />

        <SummaryCard
          title="Occupied Slots"
          value={summaryMetrics.occupiedSlots}
          subtitle={`${summaryMetrics.occupancyRate}% Utilization`}
          icon={Car}
          accentColor="rose"
          badgeText="Active Bays"
          badgeType={summaryMetrics.occupiedSlots > 25 ? 'negative' : 'warning'}
        />

        <SummaryCard
          title="Available Slots"
          value={summaryMetrics.availableSlots}
          subtitle="Min-Heap Ready"
          icon={CheckCircle2}
          accentColor="emerald"
          badgeText="Immediate Vacancy"
          badgeType="positive"
          onClick={() => navigate('/layout')}
        />

        <SummaryCard
          title="Vehicles Waiting"
          value={summaryMetrics.waitingVehicles}
          subtitle="Circular Queue Buffer"
          icon={ListOrdered}
          accentColor="amber"
          badgeText={summaryMetrics.waitingVehicles > 0 ? 'Vehicles Queued' : 'Clear'}
          badgeType={summaryMetrics.waitingVehicles > 0 ? 'warning' : 'positive'}
          onClick={() => navigate('/queue')}
        />
      </div>

      {/* ========================================================
          D. SECONDARY OPERATIONAL SUMMARY (COMPACT BAR)
          ======================================================== */}
      <div className="bg-[#172033] rounded-xl border border-[#334155] p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
          <span>Today's Operational Summary</span>
        </div>

        <div className="flex items-center gap-6 sm:gap-10 flex-wrap text-xs">
          <div>
            <span className="text-[#94A3B8]">Today's Entries:</span>
            <span className="ml-2 font-mono font-bold text-[#F8FAFC] text-sm">
              {summaryMetrics.todaysEntries}
            </span>
          </div>

          <div className="border-l border-[#334155] pl-6 sm:pl-10">
            <span className="text-[#94A3B8]">Today's Exits:</span>
            <span className="ml-2 font-mono font-bold text-[#F8FAFC] text-sm">
              {summaryMetrics.todaysExits}
            </span>
          </div>

          <div className="border-l border-[#334155] pl-6 sm:pl-10">
            <span className="text-[#94A3B8]">Today's Revenue:</span>
            <span className="ml-2 font-mono font-bold text-[#22C55E] text-sm">
              {formatCurrency(summaryMetrics.todaysRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          C. MAIN DASHBOARD CONTENT (BALANCED TWO COLUMNS)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Parking Overview (7 cols) */}
        <div className="lg:col-span-7 bg-[#172033] rounded-xl border border-[#334155] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#334155] gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-[#3B82F6]" />
                  Facility Overview — Row A Nearest Gate Bays
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Available vs occupied slot distribution
                </p>
              </div>

              {/* Occupancy bar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8]">Load:</span>
                  <div className="w-24 h-2 rounded-full bg-[#1E293B] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                      style={{ width: `${summaryMetrics.occupancyRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F8FAFC]">
                    {summaryMetrics.occupancyRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Row: Available vs Occupied */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-center">
                <span className="text-[10px] text-[#94A3B8] uppercase font-semibold">Total Capacity</span>
                <div className="text-lg font-bold font-mono text-[#F8FAFC] mt-0.5">
                  {summaryMetrics.totalSlots}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-center">
                <span className="text-[10px] text-rose-400 uppercase font-semibold">Occupied</span>
                <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">
                  {summaryMetrics.occupiedSlots}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#1E293B] border border-[#334155] text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold">Available</span>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {summaryMetrics.availableSlots}
                </div>
              </div>
            </div>

            {/* Compact Grid of Row A Preview (10 slots) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {rowASlots.map((slot) => (
                <ParkingSlot
                  key={slot.id}
                  slot={slot}
                  isSelected={false}
                  onClick={() => navigate('/layout')}
                />
              ))}
            </div>
          </div>

          {/* Button: Explore 3D Facility */}
          <div className="pt-4 border-t border-[#334155] mt-5 flex items-center justify-between">
            <span className="text-xs text-[#94A3B8]">
              30 total bays across Rows A, B, and C
            </span>
            <button
              onClick={() => navigate('/layout')}
              className="py-2 px-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore 3D Facility</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: Recent Activity (5 cols) */}
        <div className="lg:col-span-5 bg-[#172033] rounded-xl border border-[#334155] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#334155] mb-3">
              <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                Recent Activity
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
                Real-Time
              </span>
            </div>

            {/* Exactly 5 Recent Events */}
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors border border-transparent hover:border-[#334155] text-xs"
                >
                  <div
                    className={`p-1.5 rounded-md flex-shrink-0 mt-0.5 ${
                      act.type === 'ENTRY'
                        ? 'bg-[#3B82F6]/15 text-[#3B82F6]'
                        : act.type === 'EXIT'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : act.type === 'QUEUE'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    {act.type === 'ENTRY' ? (
                      <LogIn className="w-3.5 h-3.5" />
                    ) : act.type === 'EXIT' ? (
                      <LogOut className="w-3.5 h-3.5" />
                    ) : (
                      <ListOrdered className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#F8FAFC] truncate">{act.title}</span>
                      <span className="text-[10px] font-mono text-[#64748B] flex-shrink-0">
                        {formatDateTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-[#94A3B8] text-[11px] mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* View All Navigation */}
          <div className="pt-4 border-t border-[#334155] mt-4 flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">
              Showing latest {Math.min(5, recentActivities.length)} events
            </span>
            <button
              onClick={() => navigate('/records')}
              className="text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] flex items-center gap-1 transition-colors"
            >
              <span>View All Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          OCCUPANCY TREND & UTILIZATION VISUALIZATION
          ======================================================== */}
      <OccupancyChart />
    </div>
  );
}
