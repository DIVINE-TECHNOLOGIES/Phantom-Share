import React, { useState } from 'react';
import { VaultFile } from '../types';
import { 
  Lock, 
  Search, 
  FileText, 
  KeyRound, 
  ShieldCheck, 
  Trash2, 
  Share2, 
  Repeat, 
  Eye, 
  Download, 
  HardDrive,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  CheckCircle2,
  FolderLock
} from 'lucide-react';

interface VaultScreenProps {
  files: VaultFile[];
  searchQuery: string;
  onSendToConverter: (file: VaultFile) => void;
  onCreateShareLink: (file: VaultFile) => void;
  onDeleteFile: (fileId: string) => void;
}

export const VaultScreen: React.FC<VaultScreenProps> = ({
  files,
  searchQuery,
  onSendToConverter,
  onCreateShareLink,
  onDeleteFile,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<VaultFile | null>(null);

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'docx':
      case 'pdf':
      case 'txt':
      case 'md':
        return <FileText className="w-5 h-5 text-[#E5322D]" />;
      case 'png':
      case 'jpg':
      case 'svg':
        return <ImageIcon className="w-5 h-5 text-amber-500" />;
      case 'pem':
      case 'json':
      case 'yaml':
        return <KeyRound className="w-5 h-5 text-purple-600" />;
      case 'tar.gz':
      case 'zip':
        return <FileArchive className="w-5 h-5 text-blue-600" />;
      default:
        return <FileCode className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.classification.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'DOCS') {
      return ['docx', 'pdf', 'txt', 'md', 'pptx'].includes(file.extension);
    }
    if (filterType === 'KEYS') {
      return ['pem', 'json', 'yaml'].includes(file.extension);
    }
    if (filterType === 'MEDIA') {
      return ['png', 'jpg', 'svg', 'tar.gz'].includes(file.extension);
    }
    return true;
  });

  const getClassificationBadge = (cls: string) => {
    switch (cls) {
      case 'TOP SECRET':
        return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'CONFIDENTIAL':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'RESTRICTED':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col gap-6">
      {/* Top Banner (iLovePDF Style Header) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 text-[#E5322D] flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-red-900/50">
            <FolderLock className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                My Vault & Files
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-[#E5322D] dark:text-red-400 text-xs font-bold font-mono-code">
                E2EE Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Zero-knowledge encrypted cloud storage. All files sealed with Hardware AES-256 GCM client-side keys.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <div className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-right">
            <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{files.length} Encrypted Files</span>
            <span className="text-[11px] font-mono-code text-gray-400 dark:text-slate-400">3.4 GB / 10 GB Used</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm text-xs">
          {[
            { id: 'ALL', label: `All Files (${files.length})` },
            { id: 'DOCS', label: 'PDFs & Documents' },
            { id: 'KEYS', label: 'Keys & Certs' },
            { id: 'MEDIA', label: 'Scans & Images' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === tab.id
                  ? 'bg-[#E5322D] text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-500 dark:text-slate-400 font-mono-code">
          Showing {filteredFiles.length} of {files.length} items
        </span>
      </div>

      {/* File List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-750 shrink-0">
                  {getFileIcon(file.extension)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate group-hover:text-[#E5322D] dark:group-hover:text-[#EF4444] transition-colors" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-mono-code mt-0.5">
                    {file.size} • {file.uploadedAt}
                  </span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getClassificationBadge(file.classification)}`}>
                {file.classification}
              </span>
            </div>

            {/* SHA-256 fingerprint */}
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-gray-500 dark:text-slate-400">
              <span className="text-gray-400 dark:text-slate-500">SHA-256:</span>
              <span className="truncate max-w-[200px]" title={file.sha256}>
                {file.sha256.substring(0, 10)}...{file.sha256.substring(file.sha256.length - 8)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1">
                {file.contentPreview && (
                  <button
                    onClick={() => setSelectedFileForPreview(file)}
                    className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    title="Preview in RAM"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onSendToConverter(file)}
                  className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Open in Converter"
                >
                  <Repeat className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCreateShareLink(file)}
                  className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                  title="Create Ephemeral Share Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onDeleteFile(file.id)}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Shred file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RAM Preview Modal */}
      {selectedFileForPreview && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-transparent dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E5322D]" />
                <span className="font-bold text-sm text-gray-900 dark:text-slate-100">{selectedFileForPreview.name}</span>
              </div>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-mono-code text-xs text-gray-700 dark:text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
              {selectedFileForPreview.contentPreview || 'No plaintext preview available. Binary payload is encrypted at rest.'}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Decrypted in RAM buffer only
              </span>
              <button
                onClick={() => setSelectedFileForPreview(null)}
                className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-bold text-gray-800 dark:text-slate-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
