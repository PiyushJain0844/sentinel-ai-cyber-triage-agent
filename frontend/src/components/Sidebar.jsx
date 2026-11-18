import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  X,
  LogOut,
  UserCheck
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'SOC Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Live Threat Telemetry', icon: Activity },
  { path: '/incidents', label: 'Incident Management', icon: AlertOctagon },
  { path: '/investigation', label: 'Attack Investigation', icon: Search },
  { path: '/agents', label: 'Autonomous Agents', icon: Bot },
  { path: '/responses', label: 'Response Center', icon: ShieldCheck },
  { path: '/verification', label: 'Verification Center', icon: CheckCircle2 },
  { path: '/settings', label: 'System Settings', icon: Settings },
];

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0D1422] border-r border-[#1E2B42] flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Mobile Header with close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1E2B42]">
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-slate-300">
            SOC Navigation
          </span>
          <button 
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141E2E] transition"
            aria-label="Close navigation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Triage Lifecycle Banner */}
        <div className="p-3.5 mx-3 my-3 rounded-xl bg-[#141E2E] border border-[#1E2B42]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>TRIAGE PIPELINE</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
            DETECT <span className="text-sky-400">→</span> CORRELATE <span className="text-sky-400">→</span> INVESTIGATE <span className="text-sky-400">→</span> RESPOND <span className="text-sky-400">→</span> VERIFY
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
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
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141E2E] border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User Identity & Clearance Footer */}
        <div className="p-3.5 border-t border-[#1E2B42] bg-[#0A101C]">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 font-mono text-xs font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {user.clearance}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-mono">
              SENTINEL AI Enterprise SOC
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
