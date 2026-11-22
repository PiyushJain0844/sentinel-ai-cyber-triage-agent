import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { NavLink } from 'react-router-dom';
import { useSentinel, useSimulation } from '../context/SentinelContext';
=======
import { useSentinel } from '../context/SentinelContext';
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  LogOut,
<<<<<<< HEAD
  User,
  Bell,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

const primaryLinks = [
  { path: '/', label: 'Overview' },
  { path: '/agents', label: 'How it works' },
  { path: '/investigation', label: 'Investigate' },
  { path: '/incidents', label: 'Incidents' },
];

const moreLinks = [
  { path: '/monitoring', label: 'Telemetry & imports' },
  { path: '/responses', label: 'Recommended actions' },
  { path: '/verification', label: 'Verification history' },
  { path: '/settings', label: 'Integrations & settings' },
];

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    notification,
    refreshTrigger
  } = useSentinel();
  const { isSimulationRunning, runSimulation, simulationProgress, resetEnvironment } = useSimulation();

  const { user, logout } = useAuth();
  const [settings, setSettings] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
=======
  User
} from 'lucide-react';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { 
    isSimulationRunning, 
    runSampleSimulation, 
    resetEnvironment, 
    notification,
    refreshTrigger
  } = useSentinel();

  const { user, logout } = useAuth();
  const [settings, setSettings] = useState(null);
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

  useEffect(() => {
    api.getSettingsStatus().then(setSettings).catch(() => {});
  }, [refreshTrigger]);

  const isGeminiActive = settings?.ai_integration?.is_configured;

  return (
    <>
<<<<<<< HEAD
      <header className="sticky top-0 z-40 bg-[#080D18]/95 backdrop-blur-md border-b border-[#1E2B42] px-4 sm:px-7 lg:px-10 py-3 sm:py-4">
=======
      <header className="sticky top-0 z-40 bg-[#080D18]/95 backdrop-blur-md border-b border-[#1E2B42] px-3 sm:px-6 py-2.5 sm:py-3">
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#141E2E] border border-transparent hover:border-[#1E2B42] transition touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
<<<<<<< HEAD
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md shadow-sky-500/10 text-white font-black text-sm sm:text-base shrink-0">
=======
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md shadow-sky-500/10 text-white font-black text-sm sm:text-base shrink-0">
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <span className="font-sans font-bold text-base sm:text-lg text-[#1F1B18] tracking-tight">
=======
                  <span className="font-mono font-black text-base sm:text-lg text-white tracking-wider">
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
                    SENTINEL<span className="text-sky-400">.AI</span>
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SOC ONLINE
                  </span>
                </div>
<<<<<<< HEAD
                <p className="hidden xl:block text-[10px] text-slate-400 font-medium tracking-[0.16em]">
                  THREAT OPERATIONS
=======
                <p className="hidden xl:block text-[11px] text-slate-400 font-medium">
                  Autonomous Cyber Threat Investigation & Response Platform
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
                </p>
              </div>
            </div>
          </div>

<<<<<<< HEAD
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Primary navigation">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) => `rounded-full px-4 xl:px-5 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-[#EFE3DB] text-[#75482D]' : 'text-slate-500 hover:bg-[#F5ECE5] hover:text-[#75482D]'}`}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${moreOpen ? 'bg-[#EFE3DB] text-[#75482D]' : 'text-slate-500 hover:bg-[#F5ECE5] hover:text-[#75482D]'}`}
                aria-expanded={moreOpen}
                aria-label="More navigation options"
              >
                <MoreHorizontal className="w-4 h-4" />
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#E2D2C6] bg-[#FFFBF7] p-1.5 shadow-[0_14px_34px_rgba(94,61,42,0.14)]">
                  {moreLinks.map((link) => (
                    <NavLink key={link.path} to={link.path} onClick={() => setMoreOpen(false)} className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-[#EFE3DB] text-[#75482D]' : 'text-[#5E5855] hover:bg-[#F5ECE5] hover:text-[#75482D]'}`}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: SOC Status, Simulation Trigger & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* AI Engine Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F5ECE5] border border-[#E2D2C6] text-[11px] font-medium text-[#5E5855]">
              <span className={`w-2 h-2 rounded-full ${isGeminiActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {isGeminiActive ? 'AI Connected' : 'SOC Online'}
=======
          {/* Right: SOC Status, Simulation Trigger & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Engine Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1422] border border-[#1E2B42] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isGeminiActive ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-slate-300">
                {isGeminiActive ? 'Gemini 1.5 Live' : 'Deterministic SOC Engine'}
              </span>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
            </div>

            {/* Reset Simulation Button */}
            <button
              onClick={resetEnvironment}
              disabled={isSimulationRunning}
<<<<<<< HEAD
              className="p-2 rounded-full text-slate-500 hover:text-[#75482D] bg-transparent hover:bg-[#F5ECE5] transition disabled:opacity-50 touch-manipulation"
              title="Reset database to clean baseline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulationRunning ? 'animate-spin' : ''}`} />
=======
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#141E2E] hover:bg-[#192538] border border-[#1E2B42] transition disabled:opacity-50 touch-manipulation"
              title="Reset database to clean baseline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulationRunning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset</span>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
            </button>

            {/* Run Attack Simulation Button */}
            <button
<<<<<<< HEAD
              onClick={runSimulation}
              disabled={isSimulationRunning}
              title={isSimulationRunning ? (simulationProgress?.stage || 'Synthetic simulation in progress') : 'Run a paced, synthetic telemetry simulation'}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold text-[#fffaf6] bg-[#75482D] hover:bg-[#805234] active:scale-95 transition shadow-[0_4px_14px_rgba(115,70,42,0.18)] disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${isSimulationRunning ? 'animate-bounce' : ''}`} />
              <span>{isSimulationRunning ? `${simulationProgress?.events_processed || 0}/${simulationProgress?.total_events || 0} · ${simulationProgress?.seconds_remaining || 0}s` : 'Simulate'}</span>
            </button>

            <button type="button" className="relative hidden sm:inline-flex rounded-full p-2 text-slate-500 transition hover:bg-[#F5ECE5] hover:text-[#75482D]" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {notification && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D95F52] ring-2 ring-[#FBF6F2]" />}
=======
              onClick={runSampleSimulation}
              disabled={isSimulationRunning}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-95 transition shadow-md shadow-sky-500/10 disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${isSimulationRunning ? 'animate-bounce' : ''}`} />
              <span>{isSimulationRunning ? 'Running' : 'Simulate'}</span>
              <span className="hidden sm:inline">{!isSimulationRunning && ' Attack'}</span>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
            </button>

            {/* Logged In User Pill & Logout Button */}
            {user && (
<<<<<<< HEAD
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E2D2C6]">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-semibold text-[#2E2824] tracking-tight leading-tight">
=======
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#1E2B42]">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-slate-200 tracking-tight leading-tight">
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 leading-tight">
                    {user.role}
                  </span>
                </div>

<<<<<<< HEAD
                <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE3DB] text-[#75482D]" aria-hidden="true">
                  <User className="h-4 w-4" />
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 border border-transparent transition touch-manipulation"
=======
                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition touch-manipulation"
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
                  title="Sign out of SOC console"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
<<<<<<< HEAD

        {isMobileMenuOpen && (
          <nav className="lg:hidden grid grid-cols-2 gap-1.5 pt-4 mt-3 border-t border-[#E2D2C6]" aria-label="Mobile navigation">
            {[...primaryLinks, ...moreLinks].map((link) => (
              <NavLink key={link.path} to={link.path} end={link.path === '/'} onClick={() => { onToggleMobileMenu(); setMoreOpen(false); }} className={({ isActive }) => `rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-[#EFE3DB] text-[#75482D]' : 'text-slate-500 hover:bg-[#F5ECE5]'}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
      </header>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp max-w-[90vw] sm:max-w-md">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium ${
            notification.type === 'success' ? 'bg-[#0D1422] text-emerald-200 border-emerald-500/40 shadow-emerald-950/30' :
            notification.type === 'error' ? 'bg-[#0D1422] text-red-200 border-red-500/40 shadow-red-950/30' :
            'bg-[#0D1422] text-sky-200 border-sky-500/40 shadow-sky-950/30'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
};
