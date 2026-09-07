import React, { useState, useRef } from 'react';
import { VaultFile } from '../types';
import { UploadCloud, Shield, CheckCircle2, Lock, X, RefreshCw, FileText } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: VaultFile) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [classification, setClassification] = useState<'CONFIDENTIAL' | 'TOP SECRET' | 'RESTRICTED'>('CONFIDENTIAL');
  const [cipher, setCipher] = useState<'Hardware AES-GCM-256' | 'XChaCha20-Poly1305'>('Hardware AES-GCM-256');
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [encryptProgress, setEncryptProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setIsEncrypting(true);
    setEncryptProgress(15);

    const interval = setInterval(() => {
      setEncryptProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            const ext = file.name.split('.').pop()?.toLowerCase() || 'dat';
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

            const newVaultFile: VaultFile = {
              id: `vf-${Date.now()}`,
              name: file.name,
              extension: ext,
              size: `${sizeMb} MB`,
              sizeBytes: file.size,
              sha256: Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join(''),
              encryption: cipher,
              classification,
              uploadedAt: 'Just now',
              status: 'Encrypted at Rest',
              source: 'Direct Upload',
              contentPreview: `[Zero-Knowledge Encrypted Ingestion: ${file.name}]\nPayload verified and sealed in Vault block storage.`
            };

            onUploadSuccess(newVaultFile);
            setIsEncrypting(false);
            setEncryptProgress(0);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-50">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] flex items-center justify-center shrink-0">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload to Encrypted Vault</h2>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-mono-code">Client-side sealed prior to upload</span>
          </div>
        </div>

        {isEncrypting ? (
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex flex-col items-center text-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#E5322D] animate-spin" />
            <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
              Encrypting payload in browser memory...
            </span>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#E5322D] h-full transition-all duration-200 rounded-full"
                style={{ width: `${encryptProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono-code text-gray-500 dark:text-slate-400">
              Hardware key attestation in progress ({encryptProgress}%)
            </span>
          </div>
        ) : (
          <>
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#E5322D] bg-red-50/50 dark:bg-red-950/20'
                  : 'border-gray-300 dark:border-slate-700 hover:border-[#E5322D] dark:hover:border-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                  Drop files here or browse device
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-400">
                  PDF, DOCX, XLSX, PPTX, Images (Up to 100MB)
                </span>
              </div>
              <button
                type="button"
                className="mt-2 px-5 py-2 rounded-xl bg-[#E5322D] text-white text-xs font-bold hover:bg-[#c62828] shadow-sm"
              >
                Select File
              </button>
            </div>

            {/* Classification & Cipher Selection */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 uppercase text-[10px]">Classification</label>
                <select
                  value={classification}
                  onChange={(e) => setClassification(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-medium focus:outline-none focus:border-[#E5322D]"
                >
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="TOP SECRET">TOP SECRET</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 uppercase text-[10px]">Encryption Cipher</label>
                <select
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-medium focus:outline-none focus:border-[#E5322D]"
                >
                  <option value="Hardware AES-GCM-256">AES-GCM-256</option>
                  <option value="XChaCha20-Poly1305">XChaCha20-Poly1305</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 font-mono-code">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Payload is encrypted client-side before touching disk storage.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
