import React from 'react';

export const MetricCard = ({ title, value, subtext, icon: Icon, badge, variant = 'default' }) => {
  const variantStyles = {
    default: {
      border: 'border-[#1E2B42] hover:border-sky-500/40',
      icon: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      num: 'text-white'
    },
    danger: {
      border: 'border-[#1E2B42] hover:border-red-500/50',
      icon: 'bg-red-500/10 text-red-400 border-red-500/20',
      num: 'text-red-400'
    },
    warning: {
      border: 'border-[#1E2B42] hover:border-amber-500/50',
      icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      num: 'text-amber-400'
    },
    success: {
      border: 'border-[#1E2B42] hover:border-emerald-500/50',
      icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      num: 'text-emerald-400'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div className={`bg-[#141E2E] hover:bg-[#192538]/70 rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-lg flex flex-col justify-between ${style.border}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 break-words leading-snug">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border shrink-0 ${style.icon}`}>
            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${style.num}`}>
            {value}
          </span>
          {badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0D1422] text-slate-300 border border-[#1E2B42]">
              {badge}
            </span>
          )}
        </div>

        {subtext && (
          <p className="mt-1 text-[11px] sm:text-xs text-slate-400 leading-snug break-words">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
