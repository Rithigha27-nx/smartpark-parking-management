import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Layers,
  ListOrdered,
  FileSpreadsheet,
  BarChart3,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';

export default function Sidebar() {
  const { summaryMetrics, waitingQueueItems } = useParking();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/entry', label: 'Vehicle Entry', icon: LogIn },
    { to: '/exit', label: 'Vehicle Exit', icon: LogOut },
    {
      to: '/layout',
      label: '3D Parking Facility',
      icon: Layers,
      badge: `${summaryMetrics.availableSlots} free`,
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
    {
      to: '/queue',
      label: 'Waiting Queue',
      icon: ListOrdered,
      badge: waitingQueueItems.length > 0 ? `${waitingQueueItems.length}` : null,
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    { to: '/records', label: 'Vehicle Records', icon: FileSpreadsheet },
    { to: '/reports', label: 'Analytics', icon: BarChart3 },
    { to: '/dsa', label: 'DSA Insights', icon: Cpu },
  ];

  return (
    <aside
      className={`bg-[#0F172A] text-[#94A3B8] flex flex-col flex-shrink-0 border-r border-[#334155] select-none transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#334155] justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 flex-shrink-0">
            <span className="text-base font-extrabold tracking-wider">SP</span>
          </div>
          {!isCollapsed && (
            <div className="leading-tight transition-opacity duration-200">
              <div className="font-bold text-[#F8FAFC] tracking-tight text-sm flex items-center gap-1.5">
                SmartPark
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">Vellore Central</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-[#64748B] uppercase">
            Operations
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                } py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-semibold border border-[#3B82F6]/30'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Settings Navigation */}
      <div className="p-2.5 border-t border-[#334155]">
        <NavLink
          to="/settings"
          title={isCollapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `flex items-center ${
              isCollapsed ? 'justify-center px-2' : 'justify-start px-3'
            } py-2.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-semibold border border-[#3B82F6]/30'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
