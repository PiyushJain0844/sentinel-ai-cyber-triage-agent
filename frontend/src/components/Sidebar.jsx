import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  AlertOctagon, 
  Search, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Settings,
  Flame,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Live Threat Monitoring', icon: Activity },
  { path: '/incidents', label: 'Incident Management', icon: AlertOctagon },
  { path: '/investigation', label: 'Attack Investigation', icon: Search, badge: 'USP 1 & 2' },
  { path: '/agents', label: 'AI Agent Activity', icon: Bot, badge: '6 Agents' },
  { path: '/responses', label: 'Response Center', icon: ShieldCheck },
  { path: '/verification', label: 'Verification Center', icon: CheckCircle2, badge: 'USP 3' },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A1120] border-r border-[#1E293B] flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Mobile Header with close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1E293B]">
          <span className="font-mono font-bold text-sm text-white">NAVIGATION MENU</span>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Banner */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-gradient-to-br from-[#101827] to-[#151F30] border border-[#1E293B]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>TRIAGE WORKFLOW</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 leading-tight">
            DETECT <span className="text-sky-400">→</span> CORRELATE <span className="text-sky-400">→</span> INVESTIGATE <span className="text-sky-400">→</span> RESPOND <span className="text-sky-400">→</span> VERIFY
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group
                  ${isActive 
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-md shadow-sky-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151F30] border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#151F30] text-sky-300 border border-[#1E293B]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Sentinel Motto */}
        <div className="p-4 border-t border-[#1E293B] bg-[#080D18]/50">
          <div className="text-[11px] text-slate-400 leading-snug">
            <span className="text-slate-300 font-semibold">SENTINEL AI</span>
            <p className="mt-0.5">"From Alert to Verified Resolution"</p>
          </div>
        </div>
      </aside>
    </>
  );
};
