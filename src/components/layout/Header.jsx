import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Building2,
  User,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { normalizePlate, formatPlateDisplay } from '../../utils/formatters';

export default function Header() {
  const { settings, vehicleHashTable, slots, notifications, removeNotification } = useParking();
  const navigate = useNavigate();

  // Clock in Indian Standard Time (Asia/Kolkata)
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatted date and time strings (DD MMM YYYY, 12-hr with AM/PM)
  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Global Quick Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const cleaned = normalizePlate(query);

    if (cleaned.length >= 2) {
      const result = vehicleHashTable.search(cleaned);
      if (result && result.found) {
        setSearchResult({
          found: true,
          vehicle: result.value,
          probeSteps: result.probeSteps,
          bucketIndex: result.bucketIndex,
        });
      } else {
        // Also check if any partial match exists in slots
        const matchedSlot = slots.find(
          (s) =>
            s.status === 'occupied' &&
            s.vehicle &&
            normalizePlate(s.vehicle.registrationNumber).includes(cleaned)
        );
        if (matchedSlot) {
          setSearchResult({
            found: true,
            vehicle: matchedSlot.vehicle,
            slotId: matchedSlot.id,
            isPartial: true,
          });
        } else {
          setSearchResult({ found: false, query: cleaned });
        }
      }
      setIsDropdownOpen(true);
    } else {
      setSearchResult(null);
      setIsDropdownOpen(false);
    }
  };

  const handleSelectVehicle = (regNum) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    navigate(`/records?search=${encodeURIComponent(regNum)}`);
  };

  return (
    <header className="h-16 bg-[#0F172A] border-b border-[#334155] px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Facility Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#1E293B] border border-[#334155] text-[#3B82F6]">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F8FAFC] text-xs sm:text-sm tracking-tight">
              {settings.facilityName}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
              {settings.facilityCode}
            </span>
          </div>
          <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <span>{settings.facilityLocation || 'Vellore, Tamil Nadu, India'}</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="relative w-72 lg:w-96 hidden md:block" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
            placeholder="Search vehicle plate (e.g. TN 23 AB 1234)..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#172033] hover:bg-[#1E293B] focus:bg-[#1E293B] text-xs border border-[#334155] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all font-mono"
          />
        </div>

        {/* Instant Search Results Dropdown */}
        {isDropdownOpen && searchResult && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#172033] rounded-lg shadow-xl border border-[#334155] overflow-hidden z-50 text-xs">
            {searchResult.found ? (
              <div
                onClick={() => handleSelectVehicle(searchResult.vehicle.registrationNumber)}
                className="p-3 hover:bg-[#1E293B] cursor-pointer border-b border-[#334155] last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#60A5FA] text-sm">
                    {formatPlateDisplay(searchResult.vehicle.registrationNumber)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    Parked • Slot {searchResult.vehicle.slotId}
                  </span>
                </div>
                <div className="mt-1 text-[#94A3B8] flex items-center justify-between text-[11px]">
                  <span>
                    {searchResult.vehicle.vehicleType} • {searchResult.vehicle.driverName || 'Visitor'}
                  </span>
                  <span className="text-[#64748B] flex items-center gap-1 font-mono">
                    Hash Match <ExternalLink className="w-3 h-3 text-[#3B82F6]" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 text-center text-[#94A3B8]">
                No active vehicle found matching &ldquo;{searchResult.query}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Live Clock & Operator */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* IST Clock */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#94A3B8] border-r border-[#334155] pr-4 lg:pr-5">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          <div className="font-mono text-[11px]">
            <span>{formattedDate}</span>
            <span className="mx-1.5 text-[#334155]">•</span>
            <span className="font-semibold text-[#F8FAFC]">{formattedTime}</span>
            <span className="ml-1 text-[10px] text-[#64748B]">IST</span>
          </div>
        </div>

        {/* Operator Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#3B82F6] font-semibold text-xs">
            {settings.operatorName ? settings.operatorName.charAt(0) : 'A'}
          </div>
          <div className="text-left text-xs">
            <div className="font-medium text-[#F8FAFC] flex items-center gap-1.5">
              <span>{settings.operatorName}</span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" title="Active Shift" />
            </div>
            <div className="text-[10px] text-[#94A3B8]">{settings.operatorRole}</div>
          </div>
        </div>
      </div>

      {/* Floating System Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-lg shadow-xl border flex items-start gap-3 transition-all ${
                notif.type === 'success'
                  ? 'bg-[#172033] border-emerald-500/50 text-[#F8FAFC]'
                  : notif.type === 'warning'
                  ? 'bg-[#172033] border-amber-500/50 text-[#F8FAFC]'
                  : notif.type === 'error'
                  ? 'bg-[#172033] border-red-500/50 text-[#F8FAFC]'
                  : 'bg-[#172033] border-[#3B82F6]/50 text-[#F8FAFC]'
              }`}
            >
              {notif.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
              ) : notif.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              ) : (
                <Bell className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs leading-relaxed font-medium">
                {notif.message}
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
