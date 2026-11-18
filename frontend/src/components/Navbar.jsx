import React, { useState, useEffect } from 'react';
import { useSentinel } from '../context/SentinelContext';
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

  useEffect(() => {
    api.getSettingsStatus().then(setSettings).catch(() => {});
  }, [refreshTrigger]);

  const isGeminiActive = settings?.ai_integration?.is_configured;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080D18]/95 backdrop-blur-md border-b border-[#1E2B42] px-3 sm:px-6 py-2.5 sm:py-3">
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
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-md shadow-sky-500/10 text-white font-black text-sm sm:text-base shrink-0">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base sm:text-lg text-white tracking-wider">
                    SENTINEL<span className="text-sky-400">.AI</span>
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SOC ONLINE
                  </span>
                </div>
                <p className="hidden xl:block text-[11px] text-slate-400 font-medium">
                  Autonomous Cyber Threat Investigation & Response Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right: SOC Status, Simulation Trigger & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Engine Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1422] border border-[#1E2B42] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isGeminiActive ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-slate-300">
                {isGeminiActive ? 'Gemini 1.5 Live' : 'Deterministic SOC Engine'}
              </span>
            </div>

            {/* Reset Simulation Button */}
            <button
              onClick={resetEnvironment}
              disabled={isSimulationRunning}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#141E2E] hover:bg-[#192538] border border-[#1E2B42] transition disabled:opacity-50 touch-manipulation"
              title="Reset database to clean baseline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulationRunning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Run Attack Simulation Button */}
            <button
              onClick={runSampleSimulation}
              disabled={isSimulationRunning}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:scale-95 transition shadow-md shadow-sky-500/10 disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${isSimulationRunning ? 'animate-bounce' : ''}`} />
              <span>{isSimulationRunning ? 'Running' : 'Simulate'}</span>
              <span className="hidden sm:inline">{!isSimulationRunning && ' Attack'}</span>
            </button>

            {/* Logged In User Pill & Logout Button */}
            {user && (
              <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#1E2B42]">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-xs font-bold text-slate-200 tracking-tight leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 leading-tight">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition touch-manipulation"
                  title="Sign out of SOC console"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
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
