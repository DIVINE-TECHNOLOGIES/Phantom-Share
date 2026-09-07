import React from 'react';
import { NavigationTab } from '../types';
import { 
  Lock, 
  Repeat, 
  Clock, 
  Terminal, 
  Shield, 
  CheckCircle2, 
  LockKeyhole 
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  vaultCount: number;
  sharedLinksCount: number;
  onLockSession: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  vaultCount,
  sharedLinksCount,
  onLockSession,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'vault-and-files' as NavigationTab,
      label: 'Vault & Files',
      icon: Lock,
      badge: `${vaultCount} Files`,
      badgeClass: 'text-on-surface bg-surface-container-highest',
    },
    {
      id: 'file-converter' as NavigationTab,
      label: 'File Converter',
      icon: Repeat,
      badge: 'JPG, PNG, PDF',
      badgeClass: 'text-outline',
    },
    {
      id: 'shared-links-and-expiring' as NavigationTab,
      label: 'Shared Links & Expiring',
      icon: Clock,
      badge: `${sharedLinksCount} Active`,
      badgeClass: 'text-secondary bg-surface-container-highest',
    },
    {
      id: 'audit-and-activity-log' as NavigationTab,
      label: 'Audit & Activity Log',
      icon: Terminal,
    },
    {
      id: 'admin-console' as NavigationTab,
      label: 'Admin Console',
      icon: Shield,
      badge: 'ADMIN',
      badgeClass: 'text-tertiary bg-surface-container-high',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-white/5 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-lg flex items-center gap-space-md bg-surface-container-lowest border-b border-white/5">
            <img 
              alt="Phantom Share Security Logo" 
              className="h-8 w-auto object-contain shrink-0" 
              src="https://lh3.googleusercontent.com/aida/AEtjO1UcT99vUaGYEsO0tA6myMLwHDc4m8drioZ4TrZ4yl2qwnsrvZDY5ynx_XWxxZTlYIJk0_BsHScmanh60xn3Z0Jf9Ii_e2JKP9UnqAfxzDz0-dqd33lpPLWYcsvb6tGwUrEzpKFR9nXjX70N3SiJ0RtwgSzbKpiOh2hxXaxyO6DS3kKJ4OPFajDD_Sldjp0o5sM-fHktBxcBgxzA2gKqeFC_djcNZTnVOOtPsPkPKdP9SpY7fA_wH8MP5q4" 
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-semibold tracking-tight text-on-surface text-base truncate font-sans">
                  Phantom Share
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate font-sans">
                AES-256 Encrypted Workspace
              </span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="px-space-md pt-space-lg pb-space-xs">
            <span className="px-space-sm text-[11px] font-medium uppercase tracking-wider text-outline">
              Workspace Modules
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-space-md mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-space-md py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-md min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-on-primary-container' : 'text-outline'}`} />
                    <span className="text-sm truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span 
                      className={`text-xs px-1.5 py-0.5 rounded font-mono-code font-medium shrink-0 ml-2 ${
                        isActive ? 'text-on-primary-container/80 bg-black/20' : item.badgeClass
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Workspace Security & Profile Box */}
        <div className="flex flex-col gap-space-md p-space-md bg-surface-container-lowest border-t border-white/5">
          {/* Zero-Knowledge Card */}
          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-on-surface font-semibold truncate">
                  Zero-Knowledge Active
                </span>
                <span className="text-[11px] text-on-surface-variant truncate font-mono-code">
                  Hardware AES-GCM-256
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0 ml-1"></div>
          </div>

          {/* Storage Quota */}
          <div className="flex flex-col gap-1.5 px-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Storage Quota</span>
              <span className="font-mono-code text-on-surface font-medium">3.4 GB / 10 GB</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[34%] rounded-full transition-all duration-500"></div>
            </div>
          </div>

          {/* User Profile */}
          <div className="pt-1 flex items-center justify-between gap-space-sm border-t border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkhOllwjcKdCi8aedp6FWjUKPh6VCwBwTIDrif-n7mP6Z77c8ces0YNp01PQkDbFgHTzOedoOLbY1KHynBjCYqgFwCg7bpgFDpyMql1MAHqrrMu9AHCkPtsx1YVf8YeU6orYYqKP3PAhJwK29Tvy_EvxN9imyYB6KIaiFtJDlHddk3NfZ5vXYeBk1iSEaU7rYF69-3LkinqLAWzSezxKbY5YdyDjRBqMVYwukVCnKo_SmnZMhT-eWm" 
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-on-surface font-semibold truncate">
                  Sarah Jenkins
                </span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  Lead Security Eng
                </span>
              </div>
            </div>
            <button 
              onClick={onLockSession}
              className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors shrink-0" 
              title="Lock Vault Session" 
              type="button"
            >
              <LockKeyhole className="w-4 h-4 text-outline hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
