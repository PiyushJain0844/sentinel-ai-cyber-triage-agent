<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { ChevronDown, RotateCw } from 'lucide-react';
import { api } from '../services/api';
import { useSentinel, useSimulation } from '../context/SentinelContext';

const steps = [
  ['Log Monitoring Agent', 'Collects uploaded events and maps common fields into a consistent record.'],
  ['Threat Detection Agent', 'Checks each event against suspicious behavior rules.'],
  ['Alert Correlation Agent', 'Groups alerts that share an account, address, or device.'],
  ['Investigation Agent', 'Builds a timeline and findings linked to the source events.'],
  ['Response Agent', 'Suggests actions for an analyst to review and approve.'],
  ['Verification Agent', 'Records a simulated check after an approved response action.'],
];

const pill = (status) => {
  const value = (status || 'IDLE').toUpperCase();
  const color = value.includes('PROCESS') ? 'bg-amber-100 text-amber-800' : value.includes('WAIT') ? 'bg-orange-100 text-orange-800' : value.includes('COMPLETE') ? 'bg-green-100 text-green-800' : value.includes('FAIL') ? 'bg-red-100 text-red-800' : 'bg-[#f1e7df] text-[#71675F]';
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${color}`}>{value.replaceAll('_', ' ').toLowerCase()}</span>;
=======
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { AgentStatusBadge } from '../components/StatusBadge';
import { 
  Bot, 
  FileSearch, 
  ShieldAlert, 
  GitMerge, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCw,
  Clock,
  Terminal,
  Layers
} from 'lucide-react';

const agentDetails = {
  "Log Monitoring Agent": {
    icon: FileSearch,
    order: 1,
    description: "Ingests raw security logs, parses incoming fields, normalizes schemas, and forwards suspicious events.",
    color: "#38BDF8"
  },
  "Threat Detection Agent": {
    icon: ShieldAlert,
    order: 2,
    description: "Combines rule-based detection and heuristics to detect brute force, impossible travel, and command execution anomalies.",
    color: "#F59E0B"
  },
  "Alert Correlation Agent": {
    icon: GitMerge,
    order: 3,
    description: "Correlates disparate alerts across shared IP, username, and device entities to reconstruct the cross-alert attack graph.",
    color: "#A855F7"
  },
  "Investigation Agent": {
    icon: FileText,
    order: 4,
    description: "Builds evidence-first findings where every conclusion is traceable back to concrete log events. Generates threat assessment reports.",
    color: "#EC4899"
  },
  "Response Agent": {
    icon: ShieldCheck,
    order: 5,
    description: "Recommends targeted containment actions, enforces human approval gating, and performs safe execution simulation.",
    color: "#3B82F6"
  },
  "Verification Agent": {
    icon: CheckCircle2,
    order: 6,
    description: "Closed-loop verification: confirms session revocation, probes persistence, and reopens incident if threat persists.",
    color: "#22C55E"
  }
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
};

export const AgentActivityPage = () => {
  const { refreshTrigger, triggerRefresh } = useSentinel();
<<<<<<< HEAD
  const { simulationProgress } = useSimulation();
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    let active = true;
    api.getAgentsStatus().then((data) => { if (active) { setAgents(data); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refreshTrigger, simulationProgress?.events_processed]);

  const byName = Object.fromEntries(agents.map((agent) => [agent.name, agent]));

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/80 bg-[#FFFBF7]/85 p-6 shadow-[0_12px_32px_rgba(94,61,42,0.055)] sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#75482D]">Processing steps</p><h1 className="mt-1 text-3xl font-medium tracking-tight text-[#211b17]">How events are analyzed</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#625951]">Follow the path from an imported log to an analyst-reviewed recommendation. Open a step for its current task and output details.</p></div>
          <button onClick={triggerRefresh} className="inline-flex items-center gap-2 rounded-full border border-[#d9c6b7] px-3.5 py-2 text-sm text-[#75482D] hover:bg-[#f7eee7]"><RotateCw className="h-4 w-4" />Refresh</button>
        </div>
      </section>

      {loading ? <div className="py-12 text-center text-sm text-[#71675F]">Loading processing status…</div> : (
        <ol className="space-y-3">
          {steps.map(([name, description], index) => {
            const agent = byName[name] || {};
            return (
              <li key={name} className="rounded-2xl border border-white/80 bg-[#FFFBF7]/85 shadow-[0_8px_22px_rgba(94,61,42,0.04)]">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f4e9e0] text-sm font-semibold text-[#75482D]">{index + 1}</span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#302720]">{name.replace(' Agent', '')}</span><span className="mt-0.5 block text-xs leading-relaxed text-[#71675F]">{description}</span></span>
                    {pill(agent.status)}<ChevronDown className="h-4 w-4 shrink-0 text-[#918780] transition group-open:rotate-180" />
                  </summary>
                  <div className="grid gap-3 border-t border-[#eee4dc] px-4 py-4 text-sm sm:grid-cols-3 sm:px-5">
                    <div><div className="text-[11px] uppercase tracking-wide text-[#918780]">Current task</div><div className="mt-1 break-words text-[#514840]">{agent.current_task || 'Waiting for new events'}</div></div>
                    <div><div className="text-[11px] uppercase tracking-wide text-[#918780]">Events processed</div><div className="mt-1 text-[#514840]">{agent.processed_count ?? 0}</div></div>
                    <div><div className="text-[11px] uppercase tracking-wide text-[#918780]">Latest output</div><div className="mt-1 break-words text-[#514840]">{agent.latest_output || 'No output recorded yet'}</div></div>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      )}
      <p className="px-1 text-xs leading-relaxed text-[#8b8078]">Automated findings are triage signals for analyst review. Response execution and verification are simulated unless a real provider connector is configured.</p>
=======
    let isMounted = true;
    setLoading(true);
    api.getAgentsStatus().then((data) => {
      if (isMounted) {
        setAgents(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
              Autonomous Agent Operations
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono font-semibold border border-sky-500/20 tracking-wider">
              PIPELINE ORCHESTRATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Real-time status, execution metrics, and audit trail of each agent in the triage pipeline.
          </p>
        </div>

        <button
          onClick={() => triggerRefresh()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0D1422] hover:bg-[#192538] border border-[#1E2B42] transition self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Agents</span>
        </button>
      </div>

      {/* Visual Pipeline Flow Header */}
      <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1E2B42] overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] text-xs font-mono font-bold text-slate-400">
          <span className="text-sky-400">1. MONITORING</span>
          <span>→</span>
          <span className="text-amber-400">2. DETECTION</span>
          <span>→</span>
          <span className="text-purple-400">3. CORRELATION</span>
          <span>→</span>
          <span className="text-pink-400">4. INVESTIGATION</span>
          <span>→</span>
          <span className="text-blue-400">5. RESPONSE</span>
          <span>→</span>
          <span className="text-emerald-400">6. VERIFICATION</span>
        </div>
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {agents.map((agent) => {
          const meta = agentDetails[agent.name] || {
            icon: Bot,
            order: 0,
            description: agent.role,
            color: '#38BDF8'
          };
          const Icon = meta.icon;

          return (
            <div 
              key={agent.name}
              className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] hover:border-sky-500/40 transition shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Agent Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1E2B42]">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="p-2 rounded-xl border text-white shrink-0"
                      style={{ backgroundColor: `${meta.color}15`, borderColor: `${meta.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: meta.color }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase">STAGE {meta.order} OF 6</div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{agent.name}</h3>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <AgentStatusBadge status={agent.status} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mt-3">
                  {meta.description}
                </p>

                {/* Current Task Box */}
                <div className="mt-4 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Current Task:
                  </div>
                  <div className="text-xs font-mono text-slate-200 break-words">
                    {agent.current_task}
                  </div>
                </div>

                {/* Latest Output Box */}
                {agent.latest_output && (
                  <div className="mt-2 p-3 rounded-xl bg-[#080D18] border border-[#1E2B42] space-y-1">
                    <div className="text-[10px] font-mono uppercase text-sky-400 font-semibold flex items-center gap-1">
                      <Terminal className="w-3 h-3" /> Output Telemetry:
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 leading-relaxed break-words">
                      {agent.latest_output}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Metrics */}
              <div className="pt-3 border-t border-[#1E2B42] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  {agent.processed_count} Events Processed
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {agent.execution_duration_ms || 15}ms Latency
                </span>
              </div>
            </div>
          );
        })}
      </div>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    </div>
  );
};
