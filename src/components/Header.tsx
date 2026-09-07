import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  ChevronDown, 
  Search, 
  Lock, 
  Clock, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  Menu, 
  X, 
  UploadCloud, 
  Sparkles,
  LockKeyhole,
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  Stamp,
  RotateCw,
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { NavigationTab, PDFToolId } from '../types';
import { PDF_TOOLS } from '../data/toolsData';
import { PhantomLogo } from './PhantomLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectTool: (toolId: PDFToolId) => void;
  vaultCount: number;
  sharedLinksCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenUpload: () => void;
  onLockSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onSelectTool,
  vaultCount,
  sharedLinksCount,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onLockSession,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isConvertDropdownOpen, setIsConvertDropdownOpen] = useState<boolean>(false);
  const [isAllToolsOpen, setIsAllToolsOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const convertDropdownRef = useRef<HTMLDivElement | null>(null);
  const allToolsRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (convertDropdownRef.current && !convertDropdownRef.current.contains(e.target as Node)) {
        setIsConvertDropdownOpen(false);
      }
      if (allToolsRef.current && !allToolsRef.current.contains(e.target as Node)) {
        setIsAllToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const convertTools = [
    { id: 'jpg-to-pdf' as PDFToolId, label: 'JPG to PDF', desc: 'Convert JPG images to PDF documents' },
    { id: 'word-to-pdf' as PDFToolId, label: 'Word to PDF', desc: 'Convert DOCX to standard PDF format' },
    { id: 'powerpoint-to-pdf' as PDFToolId, label: 'PowerPoint to PDF', desc: 'Convert PPTX slideshows to PDF' },
    { id: 'excel-to-pdf' as PDFToolId, label: 'Excel to PDF', desc: 'Convert XLSX tables into PDF' },
    { id: 'pdf-to-word' as PDFToolId, label: 'PDF to Word', desc: 'Extract editable DOCX from PDF' },
    { id: 'pdf-to-jpg' as PDFToolId, label: 'PDF to JPG', desc: 'Extract pages as high-res images' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Primary Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Brand Logo - Phantom Share */}
          <button
            onClick={() => onSelectTab('file-converter')}
            className="flex items-center focus:outline-none group text-left"
          >
            <PhantomLogo size="md" showText={true} subtitle={true} separateWords={true} />
          </button>

          {/* Desktop Primary Navigation Links (iLovePDF Style) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-gray-700 dark:text-slate-200 tracking-wider">
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('merge-pdf');
              }}
              className="px-3 py-2 rounded-lg hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors uppercase"
            >
              Merge PDF
            </button>

            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('split-pdf');
              }}
              className="px-3 py-2 rounded-lg hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors uppercase"
            >
              Split PDF
            </button>

            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('compress-pdf');
              }}
              className="px-3 py-2 rounded-lg hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors uppercase"
            >
              Compress PDF
            </button>

            {/* Convert PDF Dropdown */}
            <div className="relative" ref={convertDropdownRef}>
              <button
                onClick={() => {
                  setIsConvertDropdownOpen(!isConvertDropdownOpen);
                  setIsAllToolsOpen(false);
                }}
                className={`px-3 py-2 rounded-lg hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors uppercase flex items-center gap-1 ${
                  isConvertDropdownOpen ? 'text-[#E5322D] dark:text-[#EF4444] bg-red-50 dark:bg-red-950/40' : ''
                }`}
              >
                <span>Convert PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isConvertDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isConvertDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider">
                    Fast Conversions
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {convertTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTab('file-converter');
                          onSelectTool(tool.id);
                          setIsConvertDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-slate-800/80 text-gray-800 dark:text-slate-200 hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors flex flex-col"
                      >
                        <span className="font-bold text-xs">{tool.label}</span>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 font-normal">{tool.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* All PDF Tools Mega Menu Trigger */}
            <div className="relative" ref={allToolsRef}>
              <button
                onClick={() => {
                  setIsAllToolsOpen(!isAllToolsOpen);
                  setIsConvertDropdownOpen(false);
                }}
                className={`px-3 py-2 rounded-lg hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors uppercase flex items-center gap-1 ${
                  isAllToolsOpen ? 'text-[#E5322D] dark:text-[#EF4444] bg-red-50 dark:bg-red-950/40' : ''
                }`}
              >
                <span>All PDF Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAllToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAllToolsOpen && (
                <div className="absolute -left-32 mt-2 w-[720px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E5322D] dark:text-[#EF4444]" />
                      <span className="font-bold text-sm text-gray-900 dark:text-slate-100">All PDF & Document Tools</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-mono-code">100% Client-Side & Ephemeral</span>
                  </div>

                  <div className="grid grid-cols-4 gap-6">
                    {/* Organize PDF */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                        Organize PDF
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {PDF_TOOLS.filter((t) => t.category === 'Organize PDF').map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTab('file-converter');
                              onSelectTool(t.id);
                              setIsAllToolsOpen(false);
                            }}
                            className="text-left py-1 text-gray-700 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:font-bold transition-all"
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optimize PDF */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Optimize PDF
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {PDF_TOOLS.filter((t) => t.category === 'Optimize PDF').map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTab('file-converter');
                              onSelectTool(t.id);
                              setIsAllToolsOpen(false);
                            }}
                            className="text-left py-1 text-gray-700 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:font-bold transition-all"
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Convert to PDF */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                        Convert to PDF
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {PDF_TOOLS.filter((t) => t.category === 'Convert to PDF').map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTab('file-converter');
                              onSelectTool(t.id);
                              setIsAllToolsOpen(false);
                            }}
                            className="text-left py-1 text-gray-700 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:font-bold transition-all"
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Security & Edit */}
                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                        Edit & Security
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        {PDF_TOOLS.filter((t) => t.category === 'Edit & Security').map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTab('file-converter');
                              onSelectTool(t.id);
                              setIsAllToolsOpen(false);
                            }}
                            className="text-left py-1 text-gray-700 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:font-bold transition-all"
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Workspace modules (Vault, Shared Links, Security & Actions) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Vault & Files Tab Button */}
          <button
            onClick={() => onSelectTab('vault-and-files')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'vault-and-files'
                ? 'bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] border border-red-200 dark:border-red-900/60'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
            title="Encrypted Vault"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">My Vault</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-[10px] font-mono-code font-bold">
              {vaultCount}
            </span>
          </button>

          {/* Shared Links Tab Button */}
          <button
            onClick={() => onSelectTab('shared-links-and-expiring')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'shared-links-and-expiring'
                ? 'bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] border border-red-200 dark:border-red-900/60'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
            title="Expiring Links"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Shared Links</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-[10px] font-mono-code font-bold">
              {sharedLinksCount}
            </span>
          </button>

          {/* Audit Log */}
          <button
            onClick={() => onSelectTab('audit-and-activity-log')}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'audit-and-activity-log'
                ? 'bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444]'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>

          {/* Admin */}
          <button
            onClick={() => onSelectTab('admin-console')}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'admin-console'
                ? 'bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444]'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enclave</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            id="theme-mode-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
            title={isDark ? "Switch to Light Mode" : "Switch to Deep Slate Dark Mode"}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Deep Slate Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12 duration-300" />
            )}
          </button>

          {/* Upload Dropzone Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-[#E5322D] hover:bg-[#c62828] text-white text-xs font-bold shadow-sm shadow-red-900/10 transition-all active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Authentication & User Session */}
          {user ? (
            <div className="relative pl-1.5 sm:pl-2 border-l border-gray-200 dark:border-slate-800" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-red-100 dark:hover:ring-red-900/30 transition-all focus:outline-none"
                title="Account Menu"
              >
                {user.photoURL ? (
                  <img
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-slate-700"
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#818cf8] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-800 rounded-xl mb-2">
                    {user.photoURL ? (
                      <img
                        alt={user.displayName || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                        src={user.photoURL}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#818cf8] text-white flex items-center justify-center font-bold text-sm">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">
                        {user.displayName || 'Phantom User'}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate font-mono-code">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <button
                      onClick={() => {
                        onSelectTab('vault-and-files');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 font-medium"
                    >
                      <Lock className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                      <span>My Vault ({vaultCount})</span>
                    </button>

                    <button
                      onClick={() => {
                        onLockSession();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 font-medium"
                    >
                      <LockKeyhole className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                      <span>Lock Vault Session</span>
                    </button>

                    {/* Dark Mode toggle item in menu */}
                    <button
                      onClick={toggleTheme}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center justify-between font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{isDark ? 'Light Theme' : 'Deep Slate Theme'}</span>
                      </div>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-bold">
                        {isDark ? 'Dark' : 'Light'}
                      </span>
                    </button>

                    <div className="border-t border-gray-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        await logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2 font-bold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-gray-200 dark:border-slate-800">
              <button
                onClick={() => openAuthModal('login')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-slate-300 hover:text-[#E5322D] dark:hover:text-[#EF4444] hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#E5322D] hover:bg-[#c92823] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2">
            {/* Theme Toggle row in Mobile Drawer */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-slate-200">
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>{isDark ? 'Deep Slate Mode' : 'Light Mode'}</span>
              </div>
              <button
                id="mobile-theme-toggle"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isDark ? 'bg-[#E5322D]' : 'bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => {
                onSelectTab('file-converter');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-gray-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-[#E5322D] dark:hover:text-[#EF4444]"
            >
              All PDF Tools
            </button>
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('merge-pdf');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Merge PDF
            </button>
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('split-pdf');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Split PDF
            </button>
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('compress-pdf');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Compress PDF
            </button>
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('jpg-to-pdf');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              JPG to PDF
            </button>
            <button
              onClick={() => {
                onSelectTab('file-converter');
                onSelectTool('word-to-pdf');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Word to PDF
            </button>

            <div className="border-t border-gray-200 dark:border-slate-800 pt-2 mt-1 flex flex-col gap-1">
              <button
                onClick={() => {
                  onSelectTab('vault-and-files');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>My Vault</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-xs text-gray-700 dark:text-slate-300 font-bold">{vaultCount}</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('shared-links-and-expiring');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Shared Links</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-bold">{sharedLinksCount}</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('audit-and-activity-log');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Audit Log
              </button>
              <button
                onClick={() => {
                  onSelectTab('admin-console');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Admin Console
              </button>

              {/* Mobile Auth Actions */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2">
                {user ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      {user.photoURL ? (
                        <img
                          alt={user.displayName || 'User'}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                          src={user.photoURL}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#818cf8] text-white flex items-center justify-center font-bold text-xs">
                          {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">
                          {user.displayName || 'User'}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await logout();
                      }}
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 p-1"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 text-center"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('signup');
                      }}
                      className="py-2 rounded-xl bg-[#E5322D] text-white text-xs font-bold hover:bg-[#c92823] text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
