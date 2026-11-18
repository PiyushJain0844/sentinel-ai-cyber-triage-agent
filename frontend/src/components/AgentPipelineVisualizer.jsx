import React from 'react';
import { AgentStatusBadge } from './StatusBadge';
import { 
  FileSearch, 
  ShieldAlert, 
  GitMerge, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  Activity
} from 'lucide-react';

const agentIcons = {
  "Log Monitoring Agent": FileSearch,
  "Threat Detection Agent": ShieldAlert,
  "Alert Correlation Agent": GitMerge,
  "Investigation Agent": FileText,
  "Response Agent": ShieldCheck,
  "Verification Agent": CheckCircle2
};

export const AgentPipelineVisualizer = ({ agents = [] }) => {
  return (
    <div className="bg-[#141E2E] rounded-2xl p-5 border border-[#1E2B42] shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E2B42] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Security Agent Pipeline
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Deterministic & AI agent orchestration with continuous state persistence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] sm:text-xs font-mono text-emerald-400 font-semibold">
            PIPELINE SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* Visual Agent Workflow Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.name] || Activity;

          return (
            <div 
              key={agent.name}
              className="relative bg-[#0D1422] rounded-xl p-3.5 border border-[#1E2B42] hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-[#141E2E] border border-[#1E2B42] text-sky-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <AgentStatusBadge status={agent.status} />
                </div>

                <div className="text-xs font-bold text-white tracking-tight break-words mb-1">
                  {agent.name.replace(' Agent', '')}
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {agent.current_task}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E2B42] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-sky-300 font-semibold">
                  {agent.processed_count} evts
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-2.5 h-2.5" />
                  {agent.execution_duration_ms || 12}ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
