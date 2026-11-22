import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge } from '../components/StatusBadge';
<<<<<<< HEAD
import { parseSecurityLogFile } from '../utils/parseSecurityLogFile';
import { 
  Search, 
  RotateCw, 
  Upload,
=======
import { 
  Search, 
  RotateCw, 
  PlusCircle, 
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
  Database
} from 'lucide-react';

export const LiveMonitoringPage = () => {
  const { refreshTrigger, triggerRefresh, openEvidenceViewer, showNotification } = useSentinel();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
<<<<<<< HEAD
  const [isImporting, setIsImporting] = useState(false);
=======
  const [isInjecting, setIsInjecting] = useState(false);
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

  useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await api.getEvents({
          severity: severityFilter,
          eventType: eventTypeFilter,
          search: searchTerm,
          limit: 150
        });
        if (isMounted) {
          setEvents(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    fetchEvents();
    return () => { isMounted = false; };
  }, [refreshTrigger, severityFilter, eventTypeFilter, searchTerm]);

<<<<<<< HEAD
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') triggerRefresh();
    }, 10000);
    return () => clearInterval(timer);
  }, [triggerRefresh]);

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const events = parseSecurityLogFile(file, await file.text());
      const result = await api.importEvents(events, file.name);
      showNotification(`Imported ${result.events_processed} events from ${file.name}; ${result.alerts_detected} alerts detected.`, 'success');
      triggerRefresh();
    } catch (err) {
      showNotification(`Import failed: ${err.message}`, 'error');
    } finally {
      setIsImporting(false);
      event.target.value = '';
=======
  const handleInjectSample = async () => {
    setIsInjecting(true);
    try {
      const customEvent = {
        timestamp: new Date().toISOString(),
        source_ip: "198.51.100.99",
        destination_ip: "10.0.1.25",
        username: "sarah.connor",
        device_id: "SESSION-TK-9921",
        event_type: "NETWORK_TRAFFIC",
        action: "SUSPICIOUS_BEACON_PROBE",
        resource_accessed: "PORT_443_SSL_TUNNEL",
        status: "ALERTED",
        severity: "CRITICAL",
        details: {
          threat_intel_match: "Automated persistent callback probe",
          notes: "Probe injected to test dynamic detection agent ingestion"
        }
      };
      await api.ingestEvents([customEvent]);
      showNotification('Custom telemetry event ingested and processed by Monitoring & Detection agents.', 'success');
      triggerRefresh();
    } catch (err) {
      showNotification(`Failed to inject event: ${err.message}`, 'error');
    } finally {
      setIsInjecting(false);
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-lg">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Threat Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20">
              TELEMETRY STREAM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
<<<<<<< HEAD
            Import JSON or CSV exports from your SIEM, EDR, identity provider, or network sensor. Events are normalized and analyzed here; direct connectors are not set up yet.
=======
            Raw incoming security logs normalized into standardized event schemas with behavioral anomaly detection.
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerRefresh()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0D1422] hover:bg-[#192538] border border-[#1E2B42] transition"
            title="Refresh logs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="inline">Refresh</span>
          </button>

<<<<<<< HEAD
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#75482D] hover:bg-[#805234] transition cursor-pointer ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            <span>{isImporting ? 'Importing...' : 'Import logs'}</span>
            <input className="sr-only" type="file" accept=".json,.jsonl,.ndjson,.csv,application/json,text/csv" disabled={isImporting} onChange={handleImport} />
          </label>
=======
          <button
            onClick={handleInjectSample}
            disabled={isInjecting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 transition shadow-md shadow-sky-500/10 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4 fill-current text-slate-950" />
            <span>{isInjecting ? 'Ingesting...' : 'Inject Event'}</span>
          </button>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#141E2E] rounded-2xl p-4 border border-[#1E2B42] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-lg">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search IP, user, command, file..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D1422] border border-[#1E2B42] focus:border-sky-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-[#0D1422] border border-[#1E2B42] focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono transition"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
            <option value="INFORMATIONAL">INFORMATIONAL</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="w-full bg-[#0D1422] border border-[#1E2B42] focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono transition"
          >
            <option value="ALL">All Event Types</option>
            <option value="AUTHENTICATION">AUTHENTICATION</option>
            <option value="GEOGRAPHIC_ANOMALY">GEOGRAPHIC_ANOMALY</option>
            <option value="FILE_ACCESS">FILE_ACCESS</option>
            <option value="PROCESS_EXECUTION">PROCESS_EXECUTION</option>
            <option value="NETWORK_TRAFFIC">NETWORK_TRAFFIC</option>
            <option value="DNS_QUERY">DNS_QUERY</option>
          </select>
        </div>

        {/* Total Count Pill */}
        <div className="flex items-center justify-between sm:justify-end px-2 text-xs font-mono text-slate-400">
          <span>Total: <span className="text-white font-bold mx-1">{events.length}</span> records</span>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-[#141E2E] rounded-2xl border border-[#1E2B42] shadow-lg overflow-hidden">
        <div className="sm:hidden px-4 py-2 bg-[#0D1422] border-b border-[#1E2B42] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Telemetry Stream</span>
          <span className="text-sky-400">← Swipe to view →</span>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading telemetry feed...
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Database className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">No events found matching your criteria</p>
<<<<<<< HEAD
            <p className="text-xs text-slate-500">Import a JSON, JSONL, NDJSON, or CSV export from your SIEM, EDR, or identity provider. Direct vendor connectors are not configured.</p>
=======
            <p className="text-xs text-slate-500">Try adjusting your filters or click "Inject Event" above.</p>
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E2B42] bg-[#0D1422] text-slate-400 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Type / Action</th>
                  <th className="py-3 px-4">Principal Account</th>
                  <th className="py-3 px-4">Origin IP</th>
                  <th className="py-3 px-4">Resource / Payload</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Detection Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2B42] font-mono">
                {events.map((evt) => (
                  <tr 
                    key={evt.id} 
                    className="hover:bg-[#192538]/60 transition cursor-pointer"
                    onClick={() => openEvidenceViewer(evt.id)}
                  >
                    <td className="py-3 px-4 text-sky-400 font-semibold">{evt.id}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{evt.timestamp?.substring(0, 19).replace('T', ' ')}</td>
                    <td className="py-3 px-4 text-slate-200">
                      <div>{evt.event_type}</div>
                      <div className="text-[10px] text-slate-400">{evt.action}</div>
                    </td>
                    <td className="py-3 px-4 text-amber-300">{evt.username || 'SYSTEM'}</td>
                    <td className="py-3 px-4 text-slate-300">{evt.source_ip || 'Internal'}</td>
                    <td className="py-3 px-4 text-rose-300 max-w-xs truncate" title={evt.resource_accessed}>
                      {evt.resource_accessed || 'None'}
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={evt.severity} />
                    </td>
                    <td className="py-3 px-4">
                      {evt.is_suspicious ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-red-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          Flagged
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Normal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEvidenceViewer(evt.id); }}
                        className="px-2.5 py-1 rounded bg-[#0D1422] text-sky-400 hover:text-sky-300 border border-[#1E2B42] text-[11px] transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
