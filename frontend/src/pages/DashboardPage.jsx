import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { MetricCard } from '../components/MetricCard';
import { AgentPipelineVisualizer } from '../components/AgentPipelineVisualizer';
import { SeverityBadge } from '../components/StatusBadge';
import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  ArrowUpRight, 
  Play,
  Database,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const SEVERITY_COLORS = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#38BDF8',
  LOW: '#10B981',
  INFORMATIONAL: '#64748B'
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { refreshTrigger, openEvidenceViewer } = useSentinel();
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [statsData, agentsData] = await Promise.all([
          api.getDashboardStats(),
          api.getAgentsStatus()
        ]);
        if (isMounted) {
          setStats(statsData);
          setAgents(agentsData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400">Loading Security Operations Center Telemetry...</p>
        </div>
      </div>
    );
  }

  const hasTelemetryData = stats.events_over_time && stats.events_over_time.length > 0;
  const hasSeverityData = stats.severity_distribution && stats.severity_distribution.length > 0;

  return (
    <div className="space-y-6">
      {/* Top SOC Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Security Operations Command Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ACTIVE DEFENSE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time autonomous threat triage: from raw telemetry ingestion to closed-loop containment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/investigation')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#192538] hover:bg-[#24344D] border border-[#1E2B42] transition"
          >
            <span>Active Investigation</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <MetricCard
          title="Total Events"
          value={stats.total_events}
          subtext="Raw logs ingested"
          icon={Activity}
          variant="default"
        />
        <MetricCard
          title="Active Incidents"
          value={stats.active_incidents}
          subtext="Under active triage"
          icon={ShieldAlert}
          variant={stats.active_incidents > 0 ? "danger" : "default"}
        />
        <MetricCard
          title="Critical Threats"
          value={stats.critical_threats}
          subtext="Immediate action needed"
          icon={AlertTriangle}
          variant={stats.critical_threats > 0 ? "danger" : "default"}
        />
        <MetricCard
          title="Resolved"
          value={stats.resolved_incidents}
          subtext="Closed-loop verified"
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Pending Approvals"
          value={stats.pending_approvals}
          subtext="Human authorization gate"
          icon={Clock}
          variant={stats.pending_approvals > 0 ? "warning" : "default"}
        />
        <MetricCard
          title="Baseline Events"
          value={stats.false_positives}
          subtext="Benign network traffic"
          icon={Filter}
          variant="default"
        />
      </div>

      {/* Autonomous Security Agent Pipeline */}
      <AgentPipelineVisualizer agents={agents} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Events Over Time (Area Chart) */}
        <div className="lg:col-span-2 bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-lg flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Telemetry Volume & Burst Rate
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Security event frequency across detection timeline</p>
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 shrink-0">
              UTC TIMELINE
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full min-w-0">
            {hasTelemetryData ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
                <AreaChart data={stats.events_over_time}>
                  <defs>
                    <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D1422', borderColor: '#1E2B42', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="events" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#eventGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 font-mono">
                <span>No telemetry timeline data recorded.</span>
                <span className="text-[11px] text-slate-600 mt-1">Click "Simulate Attack" to inject telemetry.</span>
              </div>
            )}
          </div>
        </div>

        {/* Severity Distribution (Pie Chart) */}
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-lg flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Threat Severity Profile
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Evaluated triage classification</p>
            </div>
          </div>

          <div className="h-48 sm:h-52 w-full min-w-0 flex items-center justify-center">
            {hasSeverityData ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
                <PieChart>
                  <Pie
                    data={stats.severity_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.severity_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#38BDF8'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D1422', borderColor: '#1E2B42', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                No threat events classified.
              </div>
            )}
          </div>

          {hasSeverityData && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E2B42]">
              {stats.severity_distribution.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: SEVERITY_COLORS[entry.name] || '#64748B' }} />
                    {entry.name}
                  </span>
                  <span className="font-mono font-semibold text-slate-200">{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Live-Style Feed */}
      <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Live Ingested Telemetry Feed
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">Click any event to inspect ground-truth evidence</p>
          </div>
          <button 
            onClick={() => navigate('/monitoring')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
          >
            Open Live Monitor <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-[#1E2B42] bg-[#0D1422] text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Time (UTC)</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Target User</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2B42] font-mono">
              {stats.recent_activity.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-[#192538]/60 transition cursor-pointer"
                  onClick={() => openEvidenceViewer(item.id)}
                >
                  <td className="py-2.5 px-3 text-sky-400 font-semibold">{item.id}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.timestamp?.substring(11, 19)}</td>
                  <td className="py-2.5 px-3 text-slate-200">{item.event_type}</td>
                  <td className="py-2.5 px-3 text-slate-300">{item.source_ip}</td>
                  <td className="py-2.5 px-3 text-amber-300">{item.username}</td>
                  <td className="py-2.5 px-3">
                    <SeverityBadge severity={item.severity} />
                  </td>
                  <td className="py-2.5 px-3">
                    {item.status === 'Suspicious' ? (
                      <span className="text-[11px] text-red-400 font-semibold">Flagged</span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Normal</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEvidenceViewer(item.id); }}
                      className="text-sky-400 hover:text-sky-300 text-[11px] font-semibold"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
