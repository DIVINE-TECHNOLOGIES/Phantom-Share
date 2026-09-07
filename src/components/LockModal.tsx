import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
}

export const LockModal: React.FC<LockModalProps> = ({ isOpen, onUnlock }) => {
  const { user } = useAuth();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1337' || pin.length >= 4 || pin === '') {
      setError(null);
      setPin('');
      onUnlock();
    } else {
      setError('Invalid Enclave Master PIN. Use 1337 or leave empty for demo.');
    }
  };

  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Sarah Jenkins');
  const userRole = user ? user.email : 'Lead Security Eng';
  const photoURL = user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuDkhOllwjcKdCi8aedp6FWjUKPh6VCwBwTIDrif-n7mP6Z77c8ces0YNp01PQkDbFgHTzOedoOLbY1KHynBjCYqgFwCg7bpgFDpyMql1MAHqrrMu9AHCkPtsx1YVf8YeU6orYYqKP3PAhJwK29Tvy_EvxN9imyYB6KIaiFtJDlHddk3NfZ5vXYeBk1iSEaU7rYF69-3LkinqLAWzSezxKbY5YdyDjRBqMVYwukVCnKo_SmnZMhT-eWm";

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-sm w-full p-8 shadow-2xl flex flex-col items-center text-center gap-5 transition-colors">
        <div className="relative">
          <img 
            alt={displayName}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#E5322D]"
            src={photoURL}
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E5322D] flex items-center justify-center text-white shadow-md">
            <LockKeyhole className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-gray-900 dark:text-white">Vault Session Locked</span>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-mono-code">{displayName} • {userRole}</span>
          <span className="text-[11px] text-gray-400 dark:text-slate-500 font-mono-code mt-0.5">Enclave Hardware Memory Sealed</span>
        </div>

        <form onSubmit={handleUnlockSubmit} className="w-full flex flex-col gap-3">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter Master PIN (e.g. 1337)"
              className="w-full h-11 px-4 text-center tracking-widest font-mono-code text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/40 transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#E5322D] hover:bg-[#c62828] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
          >
            Unlock Session
          </button>
        </form>

        <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono-code">
          Press ENTER or submit to resume ephemeral session
        </span>
      </div>
    </div>
  );
};
