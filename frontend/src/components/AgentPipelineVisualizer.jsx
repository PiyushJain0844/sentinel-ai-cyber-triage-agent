import React from 'react';
import { AgentStatusBadge } from './StatusBadge';
import { 
  FileSearch, 
  ShieldAlert, 
  GitMerge, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
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
    <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E293B] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous 6-Agent Triage Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic & AI agent orchestration with continuous state persistence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">ALL AGENTS SYNCHRONIZED</span>
        </div>
      </div>

      {/* Visual Agent Workflow Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {agents.map((agent, index) => {
          const Icon = agentIcons[agent.name] || Activity;
          const isLast = index === agents.length - 1;

          return (
            <div 
              key={agent.name}
              className="relative bg-[#101827] rounded-xl p-3.5 border border-[#1E293B] hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-md bg-[#151F30] border border-slate-800 text-sky-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <AgentStatusBadge status={agent.status} />
                </div>

                <div className="text-xs font-bold text-white tracking-tight line-clamp-1 mb-1">
                  {agent.name.replace(' Agent', '')}
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {agent.current_task}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
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
