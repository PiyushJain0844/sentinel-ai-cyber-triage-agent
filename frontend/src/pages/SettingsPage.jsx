import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { 
  Database, 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  Lock
} from 'lucide-react';

export const SettingsPage = () => {
  const { refreshTrigger } = useSentinel();
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getSettingsStatus().then((data) => {
      if (isMounted) {
        setSettingsData(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  if (loading || !settingsData) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs font-mono">
        Loading system configuration status...
      </div>
    );
  }

  const ai = settingsData.ai_integration || {};
  const db = settingsData.database || {};
  const intel = settingsData.threat_intel || {};
  const ingestion = settingsData.ingestion || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
            System & Engine Configuration
          </h1>
          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono font-semibold border border-sky-500/20 tracking-wider">
            SENTINEL PLATFORM STATUS
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Infrastructure health, AI orchestration mode, database status, and threat intelligence configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: AI Integration Status */}
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E2B42]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Engine Status
                </h3>
                <span className="text-xs text-slate-400">Gemini LLM & Deterministic Fallback</span>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                ai.is_configured 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {ai.is_configured ? 'GEMINI LIVE' : 'DETERMINISTIC FALLBACK'}
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Operational Mode:</span>
              <span className="text-white font-bold">{ai.mode}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Target Model:</span>
              <span className="text-sky-400 font-bold">{ai.model}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">API Key Configuration:</span>
              <span className="text-slate-300 flex items-center gap-1.5 break-all">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {ai.is_configured ? 'Active (Secured in Backend ENV)' : 'Unset (Zero-Failure Fallback Engaged)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Operational Continuity Notice: </span>
            SENTINEL AI never halts if external AI API keys are unavailable. The built-in deterministic threat engine replicates deep MITRE ATT&CK & evidence correlation automatically.
          </div>
        </div>

        {/* Card 2: Database Status */}
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E2B42]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Database & Telemetry Storage
                </h3>
                <span className="text-xs text-slate-400">Relational SQLite Engine</span>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                OPERATIONAL
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Database Engine:</span>
              <span className="text-white font-bold">{db.engine}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
                <div className="text-slate-400 text-[11px] truncate">Events Stored:</div>
                <div className="text-base sm:text-lg font-bold text-sky-400 mt-1">{db.records?.events ?? 0}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
                <div className="text-slate-400 text-[11px] truncate">Alerts Detected:</div>
                <div className="text-base sm:text-lg font-bold text-amber-400 mt-1">{db.records?.alerts ?? 0}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
                <div className="text-slate-400 text-[11px] truncate">Incidents Correlated:</div>
                <div className="text-base sm:text-lg font-bold text-purple-400 mt-1">{db.records?.incidents ?? 0}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
                <div className="text-slate-400 text-[11px] truncate">Responses Formulated:</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1">{db.records?.responses ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Threat Intelligence Integrations */}
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E2B42]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  External Threat Intelligence
                </h3>
                <span className="text-xs text-slate-400">IP & File Reputation Feeds</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">VirusTotal API:</span>
              <span className="text-slate-200">{intel.virustotal}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">AbuseIPDB API:</span>
              <span className="text-slate-200">{intel.abuseipdb}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Log file import:</span>
              <span className="text-slate-200">{ingestion.file_import || 'JSON, JSONL, NDJSON, CSV'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Vendor connectors:</span>
              <span className="text-slate-200">{ingestion.vendor_connectors || 'Not connected'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
              <span className="text-slate-400">Simulation:</span>
              <span className="text-slate-200">{ingestion.simulation || 'Synthetic only'}</span>
            </div>
          </div>
        </div>

        {/* Card 4: About SENTINEL AI */}
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E2B42]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  About SENTINEL AI
                </h3>
                <span className="text-xs text-slate-400">Autonomous Threat Triage & Incident Resolution</span>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-400">v{settingsData.version}</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-white font-bold">SENTINEL AI</span> is an autonomous, multi-agent cybersecurity investigation platform designed for SOC analysts. Instead of isolating security alerts, it connects disparate telemetry, reconstructs attack kill-chains, enforces evidence-first conclusions, and guarantees closed-loop remediation verification.
          </p>

          <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42] text-xs font-mono space-y-1">
            <div className="text-sky-400 font-bold uppercase tracking-wider">Core Architecture Capabilities:</div>
            <div className="text-slate-300">1. Evidence-First Investigation (Every finding backed by verified logs)</div>
            <div className="text-slate-300">2. Attack Chain Reconstruction (Interactive MITRE & telemetry graph)</div>
            <div className="text-slate-300">3. Closed-Loop Security Verification (Automated containment validation)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
