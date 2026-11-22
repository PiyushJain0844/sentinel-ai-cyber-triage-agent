<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, CheckCircle2, Clock3, FileSearch, Layers3, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useSentinel, useSimulation } from '../context/SentinelContext';
import { SeverityBadge } from '../components/StatusBadge';
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const cardStyle = 'dashboard-card rounded-3xl border border-white/80 bg-[#FFFBF7]/85 shadow-[0_12px_32px_rgba(94,61,42,0.055)]';
=======
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
  ArrowUpRight
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
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { refreshTrigger, openEvidenceViewer } = useSentinel();
<<<<<<< HEAD
  const { isSimulationRunning, simulationProgress } = useSimulation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    api.getDashboardStats().then((data) => { if (active) setStats(data); }).catch(() => {});
    return () => { active = false; };
  }, [refreshTrigger, simulationProgress?.events_processed]);

  if (!stats) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#71675F]">Loading your SOC overview…</div>;
  }

  const activity = stats.recent_activity || [];
  const events = stats.events_over_time || [];
  const severities = stats.severity_distribution || [];
  const severityColors = { CRITICAL: '#d95f52', HIGH: '#e8a760', MEDIUM: '#d8b24b', LOW: '#82956d', INFORMATIONAL: '#b9aea5' };
  const cards = [
    { label: 'Events received', value: stats.total_events || 0, icon: Layers3, note: 'Imported and simulated logs' },
    { label: 'Open incidents', value: stats.active_incidents || 0, icon: ShieldAlert, note: 'Need analyst review' },
    { label: 'Awaiting approval', value: stats.pending_approvals || 0, icon: Clock3, note: 'Response recommendations' },
    { label: 'Closed incidents', value: stats.resolved_incidents || 0, icon: CheckCircle2, note: 'See verification history' },
  ];

  return (
    <div className="dashboard-page space-y-5 sm:space-y-6">
      <section className={`${cardStyle} dashboard-hero overview-hero relative isolate flex flex-col gap-5 overflow-hidden px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between`}>
        <svg className="pointer-events-none absolute right-[18%] top-0 hidden h-full w-[38%] text-[#d9c2b0] opacity-40 lg:block" viewBox="0 0 520 200" fill="none" aria-hidden="true"><path className="overview-wave" d="M0 165C70 127 126 161 192 121S310 91 362 70 462 39 520 18" stroke="currentColor" strokeWidth="1.4"/><path className="overview-wave overview-wave-delay" d="M0 181C70 143 126 177 192 137S310 107 362 86 462 55 520 34" stroke="currentColor" strokeWidth="1.1"/><path d="M0 195C70 157 126 191 192 151S310 121 362 100 462 69 520 48" stroke="currentColor" strokeWidth="1"/></svg>
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#75482D]">Security operations overview</p>
          <h1 className="text-3xl font-medium tracking-tight text-[#211b17] sm:text-4xl">What’s happening in your SOC</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#625951]">Bring in security logs or run a synthetic exercise. SENTINEL organizes suspicious activity into evidence-linked incidents for your team to review.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate('/monitoring')} className="rounded-full border border-[#d9c6b7] px-4 py-2.5 text-sm font-medium text-[#75482D] hover:bg-[#f7eee7]">Import logs</button>
          <button onClick={() => navigate('/incidents')} className="hero-primary-action relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#75482D] px-5 py-2.5 text-sm font-medium !text-[#fffaf6]"><span className="relative z-10">View incidents</span><ArrowRight className="relative z-10 h-4 w-4" /></button>
        </div>
      </section>

      {isSimulationRunning && (
        <section className={`${cardStyle} border-[#e5cdbb] px-5 py-4`} aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#75482D]"><Activity className="h-4 w-4 animate-pulse" /> Synthetic exercise in progress</div>
            <span className="font-mono text-xs text-[#71675F]">{simulationProgress?.events_processed || 0} of {simulationProgress?.total_events || 0} events analyzed</span>
          </div>
          <div className="mt-2 text-sm text-[#514840]">{simulationProgress?.stage || 'Starting event stream'} · no external systems are changed</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#efe4db]"><div className="h-full rounded-full bg-[#95613F] transition-all duration-500" style={{ width: `${simulationProgress?.total_events ? Math.round((simulationProgress.events_processed / simulationProgress.total_events) * 100) : 3}%` }} /></div>
        </section>
      )}

      <section className="security-counts grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Security counts">
        {cards.map(({ label, value, icon: Icon, note }) => (
          <div key={label} className={`${cardStyle} flex items-center gap-4 p-5`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4e9e0] text-[#75482D]"><Icon className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="text-sm text-[#625951]">{label}</div><div className="text-2xl font-semibold leading-tight text-[#211b17]">{value}</div><div className="mt-0.5 text-xs text-[#8b8078]">{note}</div></div>
          </div>
        ))}
      </section>

      <section className={`${cardStyle} p-5 sm:p-6`} aria-labelledby="workflow-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2"><div><h2 id="workflow-title" className="text-lg font-semibold text-[#211b17]">From log to decision</h2><p className="mt-1 text-sm text-[#71675F]">Four clear stages. Evidence stays attached from start to finish.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-[#f5eee8] px-3 py-1.5 text-xs text-[#75482D]"><span className="status-pulse h-2 w-2 rounded-full bg-[#45a336]"/>Live pipeline</span></div>
        <ol className="relative grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flow-dash absolute left-[9%] right-[9%] top-6 hidden h-px bg-[#dfc9b7] xl:block" aria-hidden="true" />
          {[
            { title: 'Collect', icon: Layers3, desc: 'Normalize imported logs.' },
            { title: 'Detect & group', icon: ShieldAlert, desc: 'Find patterns and link related alerts.' },
            { title: 'Investigate', icon: Search, desc: 'Review the timeline and source events.' },
            { title: 'Respond', icon: ShieldCheck, desc: 'Approve a suggested action; verify its result.' },
          ].map(({ title, icon: Icon, desc }, index) => <li className="pipeline-step relative z-10 flex items-start gap-3 xl:flex-col xl:items-center xl:text-center" key={title}><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8d9ce] bg-[#fffaf6] text-[#75482D] shadow-[0_5px_14px_rgba(94,61,42,.08)]"><Icon className="h-5 w-5"/><span className="sr-only">Step {index + 1}</span></div><div className="xl:mt-2"><h3 className="text-sm font-semibold text-[#302720]">{index + 1}. {title}</h3><p className="mt-1 text-xs text-[#71675F]">{desc}</p></div></li>)}
        </ol>
      </section>

      <section className="telemetry-summary grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.8fr)]" aria-label="Telemetry and severity">
        <div className={`${cardStyle} p-5 sm:p-6`}>
          <div className="mb-3 flex items-start justify-between"><div><h2 className="text-lg font-semibold text-[#211b17]">Telemetry volume</h2><p className="mt-1 text-sm text-[#71675F]">Events received by time · select Telemetry for full records.</p></div><Activity className="h-5 w-5 text-[#95613F]"/></div>
          <div className="h-48 w-full">{events.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={events} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="eventFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a97852" stopOpacity={.3}/><stop offset="100%" stopColor="#a97852" stopOpacity={.02}/></linearGradient></defs><XAxis dataKey="time" tick={{ fill: '#81766e', fontSize: 11 }} axisLine={{ stroke: '#e2d2c6' }} tickLine={false}/><YAxis tick={{ fill: '#81766e', fontSize: 11 }} axisLine={false} tickLine={false} width={34}/><Tooltip contentStyle={{ background: '#FFFBF7', border: '1px solid #E2D2C6', borderRadius: 12 }}/><Area dataKey="events" type="monotone" stroke="#95613f" strokeWidth={2.2} fill="url(#eventFill)" activeDot={{ r: 5 }} isAnimationActive animationDuration={1100}/></AreaChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-[#918780]">No events yet. Import logs or start a simulation.</div>}</div>
        </div>
        <div className={`${cardStyle} p-5 sm:p-6`}>
          <div><h2 className="text-lg font-semibold text-[#211b17]">Event severity</h2><p className="mt-1 text-sm text-[#71675F]">Classification of received events.</p></div>
          {severities.length ? <div className="flex items-center gap-2"><div className="relative h-44 w-44 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={severities} dataKey="value" nameKey="name" innerRadius={48} outerRadius={68} paddingAngle={3} stroke="none" isAnimationActive animationDuration={900}>{severities.map((item) => <Cell key={item.name} fill={severityColors[item.name] || '#b9aea5'}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-semibold text-[#302720]">{stats.total_events || 0}</div></div><div className="min-w-0 flex-1 space-y-2">{severities.map((item) => <div key={item.name} className="flex items-center justify-between gap-2 text-xs text-[#514840]"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: severityColors[item.name] || '#b9aea5' }}/>{item.name}</span><span className="font-mono">{item.value}</span></div>)}</div></div> : <div className="flex h-44 items-center justify-center text-sm text-[#918780]">Severity will appear when events arrive.</div>}
        </div>
      </section>

      <section className={`${cardStyle} latest-events-panel overflow-hidden p-5 sm:p-6`} aria-labelledby="activity-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="activity-title" className="text-lg font-semibold text-[#211b17]">Latest events</h2><p className="mt-1 text-sm text-[#71675F]">Select a row to inspect its source fields and evidence.</p></div>
          <button onClick={() => navigate('/monitoring')} className="inline-flex items-center gap-1.5 text-sm font-medium text-[#95613F] hover:text-[#75482D]">All telemetry <ArrowRight className="h-4 w-4" /></button>
        </div>
        {activity.length ? (
          <div className="divide-y divide-[#eee4dc]">
            {activity.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => openEvidenceViewer(item.id)} className="event-row grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 text-left sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto_auto]">
                <span className="min-w-0"><span className="block truncate text-sm font-medium text-[#302720]">{item.action || item.event_type}</span><span className="mt-0.5 block truncate font-mono text-[11px] text-[#918780]">{item.username} · {item.source_ip}</span></span>
                <span className="hidden text-xs text-[#71675F] sm:block">{item.timestamp?.replace('T', ' ').substring(0, 19)}</span>
                <SeverityBadge severity={item.severity} />
                <FileSearch className="hidden h-4 w-4 text-[#95613F] sm:block" />
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f8f1eb] px-5 py-8 text-center"><p className="text-sm font-medium text-[#302720]">No events yet</p><p className="mt-1 text-xs text-[#71675F]">Import a log export or use Simulate in the top bar to explore the workflow.</p></div>
        )}
      </section>
=======
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
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    </div>
  );
};
