import React from 'react';

export const SeverityBadge = ({ severity }) => {
  const sev = (severity || 'INFORMATIONAL').toUpperCase();
  
  const styles = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    LOW: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    INFORMATIONAL: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  };

  const currentStyle = styles[sev] || styles.INFORMATIONAL;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        sev === 'CRITICAL' ? 'bg-red-400 animate-pulse' :
        sev === 'HIGH' ? 'bg-orange-400' :
        sev === 'MEDIUM' ? 'bg-amber-400' :
        sev === 'LOW' ? 'bg-sky-400' : 'bg-slate-400'
      }`} />
      {sev}
    </span>
  );
};

export const IncidentStatusBadge = ({ status }) => {
  const st = (status || 'THREAT_DETECTED').toUpperCase();

  const config = {
    THREAT_DETECTED: { label: 'Threat Detected', color: 'bg-red-500/15 text-red-300 border-red-500/40', dot: 'bg-red-400' },
    INVESTIGATION_COMPLETED: { label: 'Investigation Complete', color: 'bg-purple-500/15 text-purple-300 border-purple-500/40', dot: 'bg-purple-400' },
    RESPONSE_PENDING: { label: 'Response Pending', color: 'bg-amber-500/15 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' },
    RESPONSE_EXECUTED: { label: 'Response Executed', color: 'bg-blue-500/15 text-blue-300 border-blue-500/40', dot: 'bg-blue-400' },
    THREAT_CONTAINED: { label: 'Threat Contained', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' },
    VERIFICATION_FAILED: { label: 'Verification Failed', color: 'bg-red-600/20 text-red-300 border-red-500/50', dot: 'bg-red-500' },
    REOPENED_INVESTIGATION_REQUIRED: { label: 'Reopened: Threat Active', color: 'bg-rose-500/20 text-rose-300 border-rose-500/50', dot: 'bg-rose-400 animate-ping' }
  };

  const item = config[st] || { label: st, color: 'bg-slate-500/15 text-slate-300 border-slate-500/40', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${item.color}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${item.dot}`} />
      {item.label}
    </span>
  );
};

export const AgentStatusBadge = ({ status }) => {
  const st = (status || 'IDLE').toUpperCase();

  const styles = {
    IDLE: 'bg-slate-800 text-slate-300 border-slate-700',
    PROCESSING: 'bg-sky-500/20 text-sky-300 border-sky-500/50 animate-pulse',
    COMPLETED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    WAITING_APPROVAL: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    FAILED: 'bg-red-500/20 text-red-300 border-red-500/40'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${styles[st] || styles.IDLE}`}>
      {st}
    </span>
  );
};
