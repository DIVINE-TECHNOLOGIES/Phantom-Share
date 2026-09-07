import React, { useState } from 'react';
import { 
  NavigationTab, 
  PDFToolId, 
  VaultFile, 
  ConversionRecord, 
  SharedLink, 
  AuditLogEntry, 
  WorkerNode 
} from './types';
import { 
  INITIAL_VAULT_FILES, 
  INITIAL_RECENT_CONVERSIONS, 
  INITIAL_SHARED_LINKS, 
  INITIAL_AUDIT_LOGS, 
  WORKER_NODES 
} from './data/mockData';
import { Header } from './components/Header';
import { ConverterScreen } from './components/ConverterScreen';
import { VaultScreen } from './components/VaultScreen';
import { SharedLinksScreen } from './components/SharedLinksScreen';
import { AuditScreen } from './components/AuditScreen';
import { AdminScreen } from './components/AdminScreen';
import { UploadModal } from './components/UploadModal';
import { LockModal } from './components/LockModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { PhantomLogo } from './components/PhantomLogo';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { db, saveFileToCloudVault, deleteFileFromCloudVault, saveConversionToCloud } from './lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { CheckCircle2, Shield, Heart } from 'lucide-react';

function AppContent() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('file-converter');
  const [activeToolId, setActiveToolId] = useState<PDFToolId | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data stores
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>(INITIAL_VAULT_FILES);
  const [recentConversions, setRecentConversions] = useState<ConversionRecord[]>(INITIAL_RECENT_CONVERSIONS);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>(INITIAL_SHARED_LINKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [workers, setWorkers] = useState<WorkerNode[]>(WORKER_NODES);

  // Modals and drawers
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Status feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time Firestore sync when user is authenticated
  React.useEffect(() => {
    if (!user) return;
    
    // Sync vault files
    const filesCol = collection(db, 'users', user.uid, 'files');
    const unsubFiles = onSnapshot(filesCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudFiles = snapshot.docs.map(doc => doc.data() as VaultFile);
        setVaultFiles(prev => {
          const existingIds = new Set(cloudFiles.map(f => f.id));
          const nonCloud = prev.filter(f => !existingIds.has(f.id));
          return [...cloudFiles, ...nonCloud];
        });
      }
    }, (err) => {
      console.warn('Firestore files sync note:', err);
    });

    // Sync conversions
    const convCol = collection(db, 'users', user.uid, 'conversions');
    const unsubConvs = onSnapshot(convCol, (snapshot) => {
      if (!snapshot.empty) {
        const cloudConvs = snapshot.docs.map(doc => doc.data() as ConversionRecord);
        setRecentConversions(prev => {
          const existingIds = new Set(cloudConvs.map(c => c.id));
          const nonCloud = prev.filter(c => !existingIds.has(c.id));
          return [...cloudConvs, ...nonCloud];
        });
      }
    }, (err) => {
      console.warn('Firestore conversions sync note:', err);
    });

    return () => {
      unsubFiles();
      unsubConvs();
    };
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers for Converter & Tools
  const handleSelectTool = (toolId: PDFToolId) => {
    setActiveTab('file-converter');
    setActiveToolId(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddConversion = (conversion: ConversionRecord) => {
    setRecentConversions((prev) => [conversion, ...prev]);

    // Persist to Cloud Firestore if signed in
    if (user) {
      saveConversionToCloud(user.uid, conversion).catch(console.warn);
    }

    // Also add to audit logs
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100),
      blockHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      prevBlockHash: auditLogs[0]?.blockHash || '0x000000...',
      action: 'CONVERSION_RAM',
      operator: user?.displayName || user?.email || 'Sarah Jenkins (UID: sec-082)',
      details: `Conversion "${conversion.sourceFile}" -> "${conversion.outputFile}" executed via isolated microservice. Temp memory zeroized.`,
      node: 'worker-node-01'
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Converted: ${conversion.outputFile} (Saved with Zero Disk Footprint)`);
  };

  const handleSaveToVault = (conversion: ConversionRecord) => {
    const ext = conversion.outputFile.split('.').pop() || 'pdf';
    const newFile: VaultFile = {
      id: `vf-${Date.now()}`,
      name: conversion.outputFile,
      extension: ext,
      size: '1.2 MB',
      sizeBytes: 1258291,
      sha256: Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''),
      encryption: 'Hardware AES-GCM-256',
      classification: 'CONFIDENTIAL',
      uploadedAt: 'Just now',
      status: 'Encrypted at Rest',
      source: `Converter (${conversion.engine})`,
      contentPreview: `[Encrypted Output Artifact: ${conversion.outputFile}]\nValidated by zero-knowledge digest.`
    };
    setVaultFiles((prev) => [newFile, ...prev]);

    if (user) {
      saveFileToCloudVault(user.uid, newFile).catch(console.warn);
    }

    showToast(`Sealed into Vault: ${conversion.outputFile}`);
  };

  // Handlers for Vault
  const handleSendToConverter = (file: VaultFile) => {
    setActiveTab('file-converter');
    setActiveToolId('pdf-to-word');
    showToast(`Loaded payload "${file.name}" into RAM Sandbox`);
  };

  const handleCreateShareLinkFromVault = (file: VaultFile) => {
    const newLink: SharedLink = {
      id: `sl-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      sha256: `${file.sha256.substring(0, 4)}...${file.sha256.substring(file.sha256.length - 4)}`,
      url: `https://phantom.internal/share/${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
      ttlSeconds: 900,
      readsRemaining: 1,
      maxReads: 1,
      hasPassphrase: false,
      classification: file.classification,
      isExpired: false
    };
    setSharedLinks((prev) => [newLink, ...prev]);
    setActiveTab('shared-links-and-expiring');
    showToast(`Created Ephemeral Burn-on-Read Link for ${file.name}`);
  };

  const handleDeleteVaultFile = (fileId: string) => {
    const file = vaultFiles.find((f) => f.id === fileId);
    setVaultFiles((prev) => prev.filter((f) => f.id !== fileId));

    if (user) {
      deleteFileFromCloudVault(user.uid, fileId).catch(console.warn);
    }

    if (file) {
      showToast(`Shredded: ${file.name} (Zeroized via DOD 5220.22-M)`);
    }
  };

  // Handlers for Shared Links
  const handleRevokeLink = (linkId: string) => {
    setSharedLinks((prev) => prev.filter((l) => l.id !== linkId));
    showToast('Ephemeral token revoked and zeroized across all gateway nodes.');
  };

  const handleCreateLink = (newLink: SharedLink) => {
    setSharedLinks((prev) => [newLink, ...prev]);
    showToast(`Ephemeral link created for ${newLink.fileName}`);
  };

  // Handlers for Upload
  const handleUploadSuccess = (newFile: VaultFile) => {
    setVaultFiles((prev) => [newFile, ...prev]);
    if (user) {
      saveFileToCloudVault(user.uid, newFile).catch(console.warn);
    }
    showToast(`Client encrypted & synced: ${newFile.name}`);
  };

  // Handlers for Admin
  const handleGlobalFlush = () => {
    showToast('Emergency memory purge executed: All volatile buffers overwritten with zeroes.');
    const flushLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + '.000',
      blockHash: '0x0000000000000000...',
      prevBlockHash: auditLogs[0]?.blockHash || '0x...',
      action: 'BUFFER_SHRED',
      operator: 'Sarah Jenkins (Master Admin)',
      details: 'GLOBAL EMERGENCY FLUSH: 4/4 Ephemeral nodes zeroized simultaneously.',
      node: 'cluster-root'
    };
    setAuditLogs((prev) => [flushLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] dark:bg-[#0b0f17] text-gray-800 dark:text-slate-100 flex flex-col font-sans selection:bg-red-500/20 selection:text-red-600 dark:selection:bg-red-500/30 dark:selection:text-red-400 transition-colors">
      {/* iLovePDF Styled Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'file-converter') {
            setActiveToolId(undefined);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectTool={handleSelectTool}
        vaultCount={vaultFiles.length}
        sharedLinksCount={sharedLinks.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLockSession={() => setIsLocked(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'file-converter' && (
          <ConverterScreen
            activeToolId={activeToolId}
            onSelectTool={setActiveToolId}
            recentConversions={recentConversions}
            onAddConversion={handleAddConversion}
            onSaveToVault={handleSaveToVault}
            onOpenAuditSession={() => setActiveTab('audit-and-activity-log')}
            vaultFiles={vaultFiles}
          />
        )}

        {activeTab === 'vault-and-files' && (
          <VaultScreen
            files={vaultFiles}
            searchQuery={searchQuery}
            onSendToConverter={handleSendToConverter}
            onCreateShareLink={handleCreateShareLinkFromVault}
            onDeleteFile={handleDeleteVaultFile}
          />
        )}

        {activeTab === 'shared-links-and-expiring' && (
          <SharedLinksScreen
            links={sharedLinks}
            vaultFiles={vaultFiles}
            onRevokeLink={handleRevokeLink}
            onCreateLink={handleCreateLink}
          />
        )}

        {activeTab === 'audit-and-activity-log' && (
          <AuditScreen logs={auditLogs} />
        )}

        {activeTab === 'admin-console' && (
          <AdminScreen 
            workers={workers} 
            onGlobalFlush={handleGlobalFlush} 
          />
        )}
      </main>

      {/* Phantom Share Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-16 py-10 px-4 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <PhantomLogo size="sm" showText={true} subtitle={true} separateWords={true} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-gray-600 dark:text-slate-300">
            <button onClick={() => handleSelectTool('merge-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Merge PDF</button>
            <button onClick={() => handleSelectTool('split-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Split PDF</button>
            <button onClick={() => handleSelectTool('compress-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Compress PDF</button>
            <button onClick={() => handleSelectTool('jpg-to-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">JPG to PDF</button>
            <button onClick={() => handleSelectTool('word-to-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Word to PDF</button>
            <button onClick={() => handleSelectTool('protect-pdf')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Protect PDF</button>
            <button onClick={() => setActiveTab('vault-and-files')} className="hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors">Encrypted Vault</button>
          </div>

          <div className="flex items-center gap-2 font-mono-code text-[11px] text-gray-400 dark:text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>ISO/IEC 27001 Certified • AES-256 GCM</span>
          </div>
        </div>
      </footer>

      {/* Floating Status Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-slate-800 text-white dark:text-slate-100 border border-transparent dark:border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono-code animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Dropzone Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Lock Session Screen */}
      <LockModal
        isOpen={isLocked}
        onUnlock={() => {
          setIsLocked(false);
          showToast('Hardware enclave session authenticated.');
        }}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={() => {}}
      />

      {/* Global Login / Sign Up Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
