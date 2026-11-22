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
};

export const AgentActivityPage = () => {
  const { refreshTrigger, triggerRefresh } = useSentinel();
  const { simulationProgress } = useSimulation();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    </div>
  );
};
