import React from 'react';

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  accentColor = 'blue',
  onClick,
}) {
  const colorMap = {
    blue: {
      iconBg: 'bg-[#3B82F6]/15 text-[#3B82F6]',
      border: 'border-[#334155] hover:border-[#3B82F6]/60',
      glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
    emerald: {
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      border: 'border-[#334155] hover:border-emerald-500/60',
      glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
    },
    amber: {
      iconBg: 'bg-amber-500/15 text-amber-400',
      border: 'border-[#334155] hover:border-amber-500/60',
      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    rose: {
      iconBg: 'bg-rose-500/15 text-rose-400',
      border: 'border-[#334155] hover:border-rose-500/60',
      glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
    indigo: {
      iconBg: 'bg-indigo-500/15 text-indigo-400',
      border: 'border-[#334155] hover:border-indigo-500/60',
      glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    },
  };

  const currentTheme = colorMap[accentColor] || colorMap.blue;

  const badgeStyles = {
    positive: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    negative: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    neutral: 'bg-[#1E293B] text-[#94A3B8] border-[#334155]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#172033] rounded-xl border p-5 transition-all duration-200 ${currentTheme.border} ${currentTheme.glow} ${
        onClick ? 'cursor-pointer' : ''
      } relative overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-[#F8FAFC] mt-1.5 font-mono tracking-tight">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
              {subtitle}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg flex-shrink-0 ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {badgeText && (
        <div className="mt-3.5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-xs">
          <span className="text-[#64748B] text-[11px]">Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
              badgeStyles[badgeType] || badgeStyles.neutral
            }`}
          >
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
}
