import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, badge, variant = 'default' }) => {
  const borderStyles = {
    default: 'hover:border-sky-500/40',
    danger: 'hover:border-red-500/50',
    warning: 'hover:border-amber-500/50',
    success: 'hover:border-emerald-500/50'
  };

  const iconBgStyles = {
    default: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
  };

  return (
    <div className={`bg-[#151F30]/90 backdrop-blur-md rounded-xl p-3.5 sm:p-5 border border-[#1E293B] transition-all duration-300 shadow-lg ${borderStyles[variant] || borderStyles.default}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 line-clamp-1">{title}</span>
        {Icon && (
          <div className={`p-1.5 sm:p-2.5 rounded-lg shrink-0 ${iconBgStyles[variant] || iconBgStyles.default}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-mono">{value}</span>
        {badge && (
          <span className="text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-[10px] sm:text-xs text-slate-400 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
};
