import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useParking } from '../../context/ParkingContext';

export default function OccupancyChart() {
  const { slots, summaryMetrics } = useParking();

  // Hourly Occupancy Simulation / Trend data
  const hourlyData = [
    { hour: '07:00', occupancy: 6, entries: 6, exits: 0 },
    { hour: '09:00', occupancy: 14, entries: 9, exits: 1 },
    { hour: '11:00', occupancy: 22, entries: 11, exits: 3 },
    { hour: '13:00', occupancy: 26, entries: 8, exits: 4 },
    { hour: '15:00', occupancy: 21, entries: 5, exits: 10 },
    { hour: '17:00', occupancy: summaryMetrics.occupiedSlots, entries: 7, exits: 6 },
    { hour: '19:00 (Est)', occupancy: Math.max(8, summaryMetrics.occupiedSlots - 6), entries: 3, exits: 9 },
  ];

  // Vehicle Type Breakdown
  const typeCounts = slots
    .filter((s) => s.status === 'occupied' && s.vehicle)
    .reduce(
      (acc, s) => {
        const t = s.vehicle.vehicleType || 'Car';
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      },
      { Car: 0, SUV: 0, Bike: 0 }
    );

  const vehicleTypeData = [
    { name: 'Car / Sedan', value: typeCounts.Car || 0, color: '#3B82F6' },
    { name: 'SUV / Van', value: typeCounts.SUV || 0, color: '#0EA5E9' },
    { name: 'Motorbike', value: typeCounts.Bike || 0, color: '#8B5CF6' },
  ].filter((d) => d.value > 0);

  // Category Utilization Data
  const catStats = [
    {
      category: 'Standard',
      total: slots.filter((s) => s.type === 'standard').length,
      occupied: slots.filter((s) => s.type === 'standard' && s.status === 'occupied').length,
    },
    {
      category: 'Accessible',
      total: slots.filter((s) => s.type === 'accessible').length,
      occupied: slots.filter((s) => s.type === 'accessible' && s.status === 'occupied').length,
    },
    {
      category: 'Reserved',
      total: slots.filter((s) => s.type === 'reserved').length,
      occupied: slots.filter((s) => s.type === 'reserved' && s.status === 'occupied').length,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2-Column: Hourly Occupancy Trend Area Chart */}
      <div className="lg:col-span-2 bg-[#172033] rounded-xl border border-[#334155] p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#334155] mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">
              Facility Occupancy Profile (24-Hour Cycle)
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Bay utilization metrics vs inbound vehicle throughput
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
            Current: {summaryMetrics.occupancyRate}%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 30]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                }}
              />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#occupancyGradient)"
                name="Occupied Bays"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 1-Column: Category Breakdown & Vehicle Classification */}
      <div className="bg-[#172033] rounded-xl border border-[#334155] p-5 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] pb-3 border-b border-[#334155]">
            Bay Category Utilization
          </h3>
          <div className="mt-4 space-y-4">
            {catStats.map((cat) => {
              const pct = cat.total > 0 ? Math.round((cat.occupied / cat.total) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#F8FAFC]">{cat.category}</span>
                    <span className="font-mono text-[#94A3B8]">
                      {cat.occupied} / {cat.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.category === 'Accessible'
                          ? 'bg-[#3B82F6]'
                          : cat.category === 'Reserved'
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#22C55E]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Pie Breakdown of Vehicle Types */}
        <div className="pt-4 border-t border-[#334155] mt-4">
          <div className="text-xs font-semibold text-[#94A3B8] mb-2 uppercase tracking-wider text-[11px]">
            Active Vehicles by Classification
          </div>
          {vehicleTypeData.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="h-28 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleTypeData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={28}
                      outerRadius={45}
                      paddingAngle={4}
                    >
                      {vehicleTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs">
                {vehicleTypeData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[#94A3B8]">{d.name}:</span>
                    <span className="font-mono font-bold text-[#F8FAFC]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#64748B] py-3 text-center">No active vehicles parked</div>
          )}
        </div>
      </div>
    </div>
  );
}
