import React, { useState } from 'react';
import { WorkerNode } from '../types';
import { 
  Shield, 
  Cpu, 
  Server, 
  Trash2, 
  Key, 
  AlertOctagon, 
  CheckCircle2, 
  Flame, 
  RefreshCw,
  Sliders,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

interface AdminScreenProps {
  workers: WorkerNode[];
  onGlobalFlush: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ workers, onGlobalFlush }) => {
  const [shredStandard, setShredStandard] = useState<string>('DOD 5220.22-M');
  const [isRotatingKeys, setIsRotatingKeys] = useState<boolean>(false);
  const [keyRotatedSuccess, setKeyRotatedSuccess] = useState<boolean>(false);

  const handleKeyRotation = () => {
    setIsRotatingKeys(true);
    setKeyRotatedSuccess(false);
    setTimeout(() => {
      setIsRotatingKeys(false);
      setKeyRotatedSuccess(true);
      setTimeout(() => setKeyRotatedSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-red-900/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Admin & Enclave Security
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-[#E5322D] dark:text-[#EF4444] text-xs font-bold font-mono-code">
                DoD Purge Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Zero-retention microservice cluster status, memory sanitation protocols, and hardware key rotation.
            </p>
          </div>
        </div>

        <button
          onClick={onGlobalFlush}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E5322D] hover:bg-[#c62828] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Global Memory Flush</span>
        </button>
      </div>

      {/* Cluster Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between gap-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                <span className="font-bold text-sm text-gray-900 dark:text-white">{worker.name}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="flex flex-col gap-2 text-xs font-mono-code">
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>Region:</span>
                <span className="text-gray-900 dark:text-slate-200 font-semibold">{worker.region}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>RAM Buffer:</span>
                <span className="text-gray-900 dark:text-slate-200 font-semibold">{worker.memoryAllocated}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-slate-400">
                <span>Active Jobs:</span>
                <span className="text-[#E5322D] dark:text-[#EF4444] font-bold">{worker.activeJobs} conversions</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono-code text-gray-400 dark:text-slate-500">
              <span>Sanitation: {worker.sanitationCycle}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">READY</span>
            </div>
          </div>
        ))}
      </div>

      {/* Security Policies Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-6 transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#E5322D]" />
            <h2 className="font-bold text-base text-gray-900 dark:text-white">Enclave Sanitation Protocols</h2>
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500 font-mono-code">ISO/IEC 27001</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">
              RAM Zeroization Standard
            </label>
            <div className="flex flex-col gap-2">
              {['DOD 5220.22-M', 'NIST SP 800-88 REV 1', 'BSI-VSITR 7-PASS'].map((std) => (
                <button
                  key={std}
                  type="button"
                  onClick={() => setShredStandard(std)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    shredStandard === std
                      ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] dark:border-red-600'
                      : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{std}</span>
                    {shredStandard === std && <CheckCircle2 className="w-4 h-4 text-[#E5322D] dark:text-[#EF4444]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">
                Hardware Key Rotation
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Immediately re-attest TPM root keys and generate new AES-256 session pairs. All cached V8 isolate keys are instantly rotated.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {keyRotatedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>TPM Root Key rotated successfully. Merkle index updated.</span>
                </div>
              )}
              <button
                onClick={handleKeyRotation}
                disabled={isRotatingKeys}
                className="py-3 px-5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRotatingKeys ? 'animate-spin' : ''}`} />
                <span>{isRotatingKeys ? 'Rotating Hardware Enclave Keys...' : 'Rotate TPM Root Keys'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
