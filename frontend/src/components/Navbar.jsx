import React, { useState, useEffect } from 'react';
import { useSentinel } from '../context/SentinelContext';
import { api } from '../services/api';
import { 
  ShieldAlert, 
  Play, 
  RotateCcw, 
  Menu, 
  X, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { 
    isSimulationRunning, 
    runSampleSimulation, 
    resetEnvironment, 
    notification,
    refreshTrigger
  } = useSentinel();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettingsStatus().then(setSettings).catch(() => {});
  }, [refreshTrigger]);

  const isGeminiActive = settings?.ai_integration?.is_configured;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080D18]/90 backdrop-blur-xl border-b border-[#1E293B] px-2.5 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-sm sm:text-base">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-mono font-black text-sm sm:text-lg text-white tracking-wider">
                    SENTINEL<span className="text-sky-400">.AI</span>
                  </span>
                  <span className="hidden md:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    PS06 TRIAGE
                  </span>
                </div>
                <p className="hidden xl:block text-[11px] text-slate-400 font-medium">
                  Autonomous Cyber Threat Investigation & Response Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right: SOC Status & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* AI Engine Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101827] border border-[#1E293B] text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isGeminiActive ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-slate-300">
                {isGeminiActive ? 'Gemini 1.5 Live' : 'Deterministic SOC Engine'}
              </span>
            </div>

            {/* Reset Demo Button */}
            <button
              onClick={resetEnvironment}
              disabled={isSimulationRunning}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#151F30] hover:bg-[#1E293B] border border-[#1E293B] transition disabled:opacity-50 touch-manipulation"
              title="Reset database to clean baseline"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulationRunning ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Run Attack Simulation Button */}
            <button
              onClick={runSampleSimulation}
              disabled={isSimulationRunning}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 active:scale-95 transition shadow-md shadow-sky-500/20 disabled:opacity-50 touch-manipulation whitespace-nowrap"
            >
              <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${isSimulationRunning ? 'animate-bounce' : ''}`} />
              <span>{isSimulationRunning ? 'Running' : 'Simulate'}</span>
              <span className="hidden sm:inline">{!isSimulationRunning && ' Attack'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium ${
            notification.type === 'success' ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/50 glow-green' :
            notification.type === 'error' ? 'bg-red-950/95 text-red-200 border-red-500/50 glow-red' :
            'bg-[#101827]/95 text-sky-200 border-sky-500/50 glow-blue'
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
