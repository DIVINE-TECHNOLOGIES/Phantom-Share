import React from 'react';
import { Bell, X, Flame, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n-1',
      title: 'Link Expiring in < 5 Mins',
      desc: 'Shared token "root_ca_certificate.pem" reaches 0 TTL soon. Ephemeral key will be shredded.',
      time: '2 mins ago',
      type: 'warning',
      icon: Flame,
    },
    {
      id: 'n-2',
      title: 'Zero-Retention Buffer Purged',
      desc: 'Kernel memory sanitizer completed DOD 5220.22-M overwrite on node transient-lo-8092.',
      time: '8 mins ago',
      type: 'success',
      icon: CheckCircle2,
    },
    {
      id: 'n-3',
      title: 'Hardware PCR Register Check Passed',
      desc: 'All 4 WASM microservice worker sandbox nodes validated against golden PCR-0 attestation.',
      time: '24 mins ago',
      type: 'info',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end animate-in fade-in-50">
      <div 
        className="w-full max-w-sm h-full bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl transition-colors"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#E5322D] dark:text-[#EF4444]" />
              <span className="text-base font-bold text-gray-900 dark:text-white">Notifications & Alerts</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div 
                  key={n.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/70 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${
                        n.type === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                        n.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono-code">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-300 leading-relaxed font-mono-code">
                    {n.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClearAll}
            className="text-xs text-gray-500 dark:text-slate-400 hover:text-[#E5322D] dark:hover:text-[#EF4444] font-semibold transition-colors"
          >
            Clear All Alerts
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-750 text-xs font-bold text-gray-800 dark:text-slate-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
