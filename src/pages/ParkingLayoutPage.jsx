import React from 'react';
import { Grid3X3, Layers } from 'lucide-react';
import ParkingFloor from '../components/parking/ParkingFloor';

export default function ParkingLayoutPage() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-blue-600" />
          Interactive 2D Parking Facility Layout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select any bay to inspect assigned vehicle telemetry, walking distances, or toggle maintenance
        </p>
      </div>

      <ParkingFloor />
    </div>
  );
}
