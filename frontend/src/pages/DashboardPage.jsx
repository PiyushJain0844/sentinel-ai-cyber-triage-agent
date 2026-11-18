import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { MetricCard } from '../components/MetricCard';
import { SeverityBadge } from '../components/StatusBadge';
import { AgentPipelineVisualizer } from '../components/AgentPipelineVisualizer';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity, 
  Filter, 
  ArrowUpRight,
  Flame,
  Terminal,
  Zap
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
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

const SEVERITY_COLORS = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#FBBF24',
  LOW: '#38BDF8',
  INFORMATIONAL: '#64748B'
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { refreshTrigger, runSampleSimulation, openEvidenceViewer } = useSentinel();
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [dashboardData, agentData] = await Promise.all([
          api.getDashboardStats(),
          api.getAgentsStatus()
        ]);
        if (isMounted) {
          setStats(dashboardData);
          setAgents(agentData);
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
          <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono text-slate-400">Loading Sentinel SOC Telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#101827] via-[#151F30] to-[#101827] border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Security Operations Command Center
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20">
              ACTIVE DEFENSE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-agent triage: from raw telemetry ingestion to verified threat containment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/investigation')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1E293B] hover:bg-[#334155] border border-slate-700 transition"
          >
            <span>View Active Investigation</span>
            <ArrowUpRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* 6 Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
          subtext="Under multi-agent triage"
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
          subtext="Human-in-the-loop gate"
          icon={Clock}
          variant={stats.pending_approvals > 0 ? "warning" : "default"}
        />
        <MetricCard
          title="Baseline Events"
          value={stats.false_positives}
          subtext="Benign background traffic"
          icon={Filter}
          variant="default"
        />
      </div>

      {/* 6-Agent Active Pipeline Visualizer */}
      <AgentPipelineVisualizer agents={agents} />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Over Time (Area Chart) */}
        <div className="lg:col-span-2 bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Telemetry Volume & Burst Rate
              </h3>
              <p className="text-xs text-slate-400">Security event frequency across detection timeline</p>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              UTC TIMELINE
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.events_over_time}>
                <defs>
                  <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101827', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="events" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#eventGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution (Pie Chart) */}
        <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Threat Severity Profile
              </h3>
              <p className="text-xs text-slate-400">Evaluated triage classification</p>
            </div>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.severity_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.severity_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || '#38BDF8'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101827', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1E293B]">
            {stats.severity_distribution.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[entry.name] || '#64748B' }} />
                  {entry.name}
                </span>
                <span className="font-mono font-semibold text-slate-200">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Live-Style Feed */}
      <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Ingested Telemetry Feed
            </h3>
            <p className="text-xs text-slate-400">Click any event to inspect ground-truth evidence</p>
          </div>
          <button 
            onClick={() => navigate('/monitoring')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            Open Live Monitor <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Origin IP</th>
                <th className="py-2.5 px-3">Principal</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60 font-mono">
              {stats.recent_activity.map((evt) => (
                <tr 
                  key={evt.id} 
                  className="hover:bg-[#1A273D]/50 transition cursor-pointer"
                  onClick={() => openEvidenceViewer(evt.id)}
                >
                  <td className="py-3 px-3 text-sky-400 font-semibold">{evt.id}</td>
                  <td className="py-3 px-3 text-slate-400">{evt.timestamp?.substring(11, 19)}</td>
                  <td className="py-3 px-3 text-slate-300">{evt.event_type}</td>
                  <td className="py-3 px-3 text-slate-200">{evt.action}</td>
                  <td className="py-3 px-3"><SeverityBadge severity={evt.severity} /></td>
                  <td className="py-3 px-3 text-slate-300">{evt.source_ip}</td>
                  <td className="py-3 px-3 text-amber-300">{evt.username}</td>
                  <td className="py-3 px-3 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEvidenceViewer(evt.id); }}
                      className="text-[11px] text-sky-400 hover:underline px-2 py-0.5 rounded bg-[#101827] border border-[#1E293B]"
                    >
                      Evidence →
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
