import React, { useState, useEffect } from 'react';
import { SharedLink, VaultFile } from '../types';
import { 
  Clock, 
  Link as LinkIcon, 
  Flame, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  ShieldAlert, 
  Key, 
  Lock, 
  Eye,
  AlertTriangle,
  Send,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SharedLinksScreenProps {
  links: SharedLink[];
  vaultFiles: VaultFile[];
  onRevokeLink: (id: string) => void;
  onCreateLink: (newLink: SharedLink) => void;
}

export const SharedLinksScreen: React.FC<SharedLinksScreenProps> = ({
  links,
  vaultFiles,
  onRevokeLink,
  onCreateLink,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedFileId, setSelectedFileId] = useState<string>(vaultFiles[0]?.id || '');
  const [ttlChoice, setTtlChoice] = useState<number>(900); // 15 mins
  const [maxReads, setMaxReads] = useState<number>(1);
  const [passphrase, setPassphrase] = useState<string>('');

  // Live timer tick for countdowns
  const [ticker, setTicker] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTtl = (seconds: number) => {
    const remaining = Math.max(0, seconds - ticker);
    const hrs = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;

    if (remaining <= 0) return 'EXPIRED';
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const file = vaultFiles.find((f) => f.id === selectedFileId) || vaultFiles[0];
    const newLink: SharedLink = {
      id: `sl-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      sha256: `${file.sha256.substring(0, 4)}...${file.sha256.substring(file.sha256.length - 4)}`,
      url: `https://phantom.internal/share/${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
      ttlSeconds: ttlChoice,
      readsRemaining: maxReads,
      maxReads,
      hasPassphrase: passphrase.length > 0,
      classification: file.classification,
      isExpired: false
    };
    onCreateLink(newLink);
    setShowCreateModal(false);
    setPassphrase('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-100 dark:border-blue-900/40">
            <LinkIcon className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Shared Links & Ephemeral Payloads
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold font-mono-code">
                Self-Destruct
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Time-bound burn-after-reading links. Once viewed or after timer expires, payloads are permanently wiped.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E5322D] hover:bg-[#c62828] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ephemeral Link</span>
        </button>
      </div>

      {/* Active Ephemeral Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => {
          const remainingSecs = Math.max(0, link.ttlSeconds - ticker);
          const isUrgent = remainingSecs < 300 && remainingSecs > 0;
          const isDead = remainingSecs <= 0 || link.readsRemaining <= 0;

          return (
            <div
              key={link.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between gap-5 shadow-sm ${
                isDead 
                  ? 'border-red-300 dark:border-red-900/60 opacity-60 bg-red-50/20 dark:bg-red-950/20' 
                  : isUrgent 
                  ? 'border-amber-300 dark:border-amber-600/60 ring-2 ring-amber-100 dark:ring-amber-950/40' 
                  : 'border-gray-200 dark:border-slate-800 hover:shadow-md dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDead 
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400' 
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    }`}>
                      {link.maxReads === 1 ? <Flame className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {link.fileName}
                      </span>
                      <span className="text-xs font-mono-code text-gray-400 dark:text-slate-500">
                        {link.fileSize} • SHA: {link.sha256}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono-code font-bold ${
                    isDead 
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400' 
                      : isUrgent 
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                  }`}>
                    {formatTtl(link.ttlSeconds)}
                  </span>
                </div>

                {/* URL box with copy button */}
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <span className="font-mono-code text-xs text-gray-600 dark:text-slate-300 truncate">
                    {link.url}
                  </span>
                  <button
                    onClick={() => handleCopy(link.id, link.url)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-xs font-bold text-gray-700 dark:text-slate-200 shrink-0 shadow-2xs transition-colors"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status and metadata */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs font-mono-code text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Reads Left: <strong className="text-gray-900 dark:text-slate-200">{link.readsRemaining} / {link.maxReads}</strong></span>
                  {link.hasPassphrase && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                      PIN Protected
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onRevokeLink(link.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#E5322D]" />
                <span className="font-bold text-base text-gray-900 dark:text-white">New Ephemeral Share Link</span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Select Payload File</label>
                <select
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg text-xs font-mono-code focus:outline-none focus:border-[#E5322D]"
                >
                  {vaultFiles.map((vf) => (
                    <option key={vf.id} value={vf.id}>
                      {vf.name} ({vf.size})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Time To Live (TTL)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { secs: 300, label: '5 Mins' },
                    { secs: 900, label: '15 Mins' },
                    { secs: 3600, label: '1 Hour' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.secs}
                      onClick={() => setTtlChoice(t.secs)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        ttlChoice === t.secs
                          ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444]'
                          : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Burn Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMaxReads(1)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      maxReads === 1
                        ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444]'
                        : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    🔥 Single View (1-read)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxReads(5)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      maxReads === 5
                        ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444]'
                        : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    👥 Multi-read (Max 5)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Passphrase Protection (Optional)</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Optional decryption PIN"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg text-xs font-mono-code focus:outline-none focus:border-[#E5322D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E5322D] hover:bg-[#c62828] text-white text-xs font-bold shadow-md"
                >
                  Generate Ephemeral Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
