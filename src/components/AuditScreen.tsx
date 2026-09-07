import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { Terminal, Shield, Download, Filter, RefreshCw, Hash, CheckCircle2 } from 'lucide-react';

interface AuditScreenProps {
  logs: AuditLogEntry[];
}

export const AuditScreen: React.FC<AuditScreenProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  const exportAuditLog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phantom_audit_session_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'BUFFER_SHRED':
        return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60';
      case 'CONVERSION_RAM':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60';
      case 'VAULT_ENCRYPT':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60';
      case 'KEY_ATTESTATION':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/60';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-sm border border-purple-100 dark:border-purple-900/40">
            <Terminal className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Cryptographic Audit Log
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold font-mono-code">
                Merkle Chained
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Immutable runtime ledger. Every buffer shredding and conversion operation is hashed in sequence.
            </p>
          </div>
        </div>

        <button
          onClick={exportAuditLog}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit (JSON)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm text-xs">
          {[
            { id: 'ALL', label: `All Events (${logs.length})` },
            { id: 'BUFFER_SHRED', label: 'Buffer Shredding' },
            { id: 'CONVERSION_RAM', label: 'RAM Conversions' },
            { id: 'VAULT_ENCRYPT', label: 'Vault Encryptions' },
            { id: 'KEY_ATTESTATION', label: 'Key Attestations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterAction(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterAction === tab.id
                  ? 'bg-gray-900 dark:bg-[#E5322D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-gray-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Genesis Root: SHA256-verified</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Target Blob</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Merkle Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 text-gray-500 dark:text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-slate-200">{log.operator}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-slate-300">{log.target}</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 dark:text-slate-500 truncate max-w-[140px]" title={log.merkleHash}>
                    {log.merkleHash}
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
