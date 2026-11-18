import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSentinel } from '../context/SentinelContext';
import { 
  Globe, 
  User, 
  Cpu, 
  FolderLock, 
  Terminal, 
  Radio, 
  Info,
  Maximize2
} from 'lucide-react';

const categoryIcons = {
  threat_origin: Globe,
  user_account: User,
  session_device: Cpu,
  sensitive_data: FolderLock,
  execution: Terminal,
  c2_exfiltration: Radio
};

// Custom React Flow Node for SOC aesthetics
const CustomAttackNode = ({ data }) => {
  const Icon = categoryIcons[data.category] || Info;

  return (
    <div className="relative group min-w-[170px] max-w-[210px] bg-[#101827] border-2 rounded-xl p-3 shadow-2xl transition-all duration-300 hover:scale-105"
      style={{ borderColor: data.color || '#38BDF8' }}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-sky-400 !border-0" />
      
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="p-1.5 rounded-lg border text-white"
          style={{ backgroundColor: `${data.color}20`, borderColor: `${data.color}40` }}
        >
          <Icon className="w-4 h-4" style={{ color: data.color }} />
        </div>
        <span 
          className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
          style={{ backgroundColor: `${data.color}15`, color: data.color, borderColor: `${data.color}30` }}
        >
          {data.badge || 'ENTITY'}
        </span>
      </div>

      <div className="text-xs font-bold text-white whitespace-pre-line leading-tight">
        {data.label}
      </div>

      {data.entity && (
        <div className="mt-1 text-[11px] font-mono text-slate-400 truncate">
          {data.entity}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-sky-400 !border-0" />
    </div>
  );
};

export const AttackGraph = ({ graphData, onSelectNode }) => {
  const { openEvidenceViewer } = useSentinel();

  const nodeTypes = useMemo(() => ({ customNode: CustomAttackNode }), []);

  const nodes = useMemo(() => {
    if (!graphData?.nodes) return [];
    return graphData.nodes.map(n => ({
      ...n,
      type: 'customNode'
    }));
  }, [graphData]);

  const edges = useMemo(() => {
    if (!graphData?.edges) return [];
    return graphData.edges.map(e => ({
      ...e,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: e.style?.stroke || '#38BDF8'
      },
      labelStyle: { fill: '#94A3B8', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#080D18', fillOpacity: 0.9, rx: 4, stroke: '#1E293B', strokeWidth: 1 },
      labelBgPadding: [6, 4]
    }));
  }, [graphData]);

  if (!nodes.length) {
    return (
      <div className="h-80 flex flex-col items-center justify-center bg-[#080D18] rounded-xl border border-[#1E293B] text-slate-400 p-6">
        <Info className="w-8 h-8 text-sky-400 mb-2 animate-bounce" />
        <p className="text-sm font-medium text-white">No active attack graph nodes</p>
        <p className="text-xs mt-1 text-slate-400">Trigger sample simulation or ingest security telemetry to correlate attack paths.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[520px] rounded-2xl overflow-hidden border border-[#1E293B] bg-[#0A1120] shadow-2xl">
      {/* Overlay legend / USP badge */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10 flex items-center gap-1.5 sm:gap-2 bg-[#101827]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#1E293B]">
        <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
        <span className="text-[10px] sm:text-xs font-mono font-semibold text-slate-200">
          USP 2: <span className="hidden xs:inline">Cross-Alert </span>Attack Kill-Chain
        </span>
      </div>

      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 hidden sm:flex items-center gap-1.5 bg-[#101827]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#1E293B] text-[11px] font-mono text-slate-400">
        <Maximize2 className="w-3 h-3 text-sky-400" /> Pan & Zoom Enabled
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={1.5}
        onNodeClick={(_, node) => {
          if (onSelectNode) onSelectNode(node);
          // If node has event evidence, trigger evidence viewer
          if (node.data?.event_id) {
            openEvidenceViewer(node.data.event_id);
          } else if (node.id === 'node-threat-ip') openEvidenceViewer('EVT-2026-1002');
          else if (node.id === 'node-compromised-user') openEvidenceViewer('EVT-2026-1003');
          else if (node.id === 'node-session') openEvidenceViewer('EVT-2026-1004');
          else if (node.id === 'node-restricted-files') openEvidenceViewer('EVT-2026-1005');
          else if (node.id === 'node-process-exec') openEvidenceViewer('EVT-2026-1006');
          else if (node.id === 'node-c2-exfil') openEvidenceViewer('EVT-2026-1007');
        }}
      >
        <Background color="#1E293B" gap={20} size={1} />
        <Controls className="!bg-[#101827] !border-[#1E293B]" />
      </ReactFlow>
    </div>
  );
};
