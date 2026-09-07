import React, { useState, useRef } from 'react';
import { 
  VaultFile, 
  ConversionRecord, 
  PDFTool, 
  PDFToolId, 
  PDFToolCategory,
  PageMargin, 
  Orientation, 
  CompressionLevel 
} from '../types';
import { PDF_TOOLS } from '../data/toolsData';
import { ToolIcon } from './ToolIcon';
import { PhantomLogo } from './PhantomLogo';
import { 
  UploadCloud, 
  Download, 
  RotateCw, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Shield, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Share2, 
  Layers, 
  RefreshCw, 
  Flame, 
  SlidersHorizontal,
  HardDrive,
  Check,
  QrCode,
  FileCheck,
  KeyRound,
  Eye,
  FileText
} from 'lucide-react';

interface ConverterScreenProps {
  activeToolId?: PDFToolId;
  onSelectTool: (toolId: PDFToolId) => void;
  recentConversions: ConversionRecord[];
  onAddConversion: (conversion: ConversionRecord) => void;
  onSaveToVault: (conversion: ConversionRecord) => void;
  onOpenAuditSession: () => void;
  vaultFiles: VaultFile[];
}

export const ConverterScreen: React.FC<ConverterScreenProps> = ({
  activeToolId,
  onSelectTool,
  recentConversions,
  onAddConversion,
  onSaveToVault,
  onOpenAuditSession,
  vaultFiles,
}) => {
  // Hub view filters & search
  const [selectedCategory, setSelectedCategory] = useState<PDFToolCategory>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Workstation state
  const [stagedFiles, setStagedFiles] = useState<Array<{
    id: string;
    name: string;
    size: string;
    rotation: number;
    previewUrl?: string;
  }>>([]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isVaultPickerOpen, setIsVaultPickerOpen] = useState<boolean>(false);

  // Settings
  const [orientation, setOrientation] = useState<Orientation>('Portrait');
  const [pageSize, setPageSize] = useState<'A4' | 'Fit' | 'US Letter'>('A4');
  const [margin, setMargin] = useState<PageMargin>('Standard (0.75 in / 19mm)');
  const [mergeAll, setMergeAll] = useState<boolean>(true);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('High Quality');
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkPosition, setWatermarkPosition] = useState<string>('center');
  const [passwordProtection, setPasswordProtection] = useState<string>('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processStage, setProcessStage] = useState<string>('');
  const [completedResult, setCompletedResult] = useState<{
    fileName: string;
    fileSize: string;
    downloadUrl: string;
    conversionRecord: ConversionRecord;
  } | null>(null);

  // QR Modal
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Get active tool definition
  const currentTool = PDF_TOOLS.find((t) => t.id === activeToolId);

  // Filter tools for the Hub view
  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories: PDFToolCategory[] = [
    'All',
    'Organize PDF',
    'Optimize PDF',
    'Convert to PDF',
    'Convert from PDF',
    'Edit & Security',
  ];

  // Helper to load files into workstation
  const handleFilesAdded = (files: FileList | File[]) => {
    const newItems = Array.from(files).map((f, i) => {
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      return {
        id: `f-${Date.now()}-${i}`,
        name: f.name,
        size: `${sizeMb} MB`,
        rotation: 0,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      };
    });
    setStagedFiles((prev) => [...prev, ...newItems]);
    setCompletedResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRotatePage = (id: string) => {
    setStagedFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleDeletePage = (id: string) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  // Execution simulation
  const handleRunConversion = () => {
    if (stagedFiles.length === 0) return;
    setIsProcessing(true);
    setProcessProgress(10);
    setProcessStage('Allocating zero-retention memory buffer...');

    const stages = [
      { p: 30, text: 'Executing microservice conversion engine in RAM...' },
      { p: 60, text: 'Applying page orientation & vector layout...' },
      { p: 85, text: 'Sealing with ephemeral AES-GCM-256 key...' },
      { p: 100, text: 'Conversion complete! Zero disk retention.' },
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setProcessProgress(stages[currentStageIndex].p);
        setProcessStage(stages[currentStageIndex].text);
        currentStageIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          const firstFile = stagedFiles[0];
          const rawBaseName = firstFile.name.replace(/\.[^/.]+$/, '');
          const extension = currentTool?.id === 'pdf-to-jpg' ? 'zip' : 'pdf';
          const outName = `${rawBaseName}_converted.${extension}`;

          const record: ConversionRecord = {
            id: `conv-${Date.now()}`,
            sourceFile: firstFile.name,
            outputFile: outName,
            timeAgo: 'Just now',
            engine: currentTool?.title || 'Phantom Engine',
            badge: '0-RETENTION',
            badgeColor: 'primary',
            isVaultSaved: false,
            timestamp: Date.now(),
          };

          onAddConversion(record);

          // Simulated blob URL for download
          const dummyContent = `Zero-Knowledge Ephemeral PDF Output for ${firstFile.name}\nEngine: ${currentTool?.title}\nTimestamp: ${new Date().toISOString()}`;
          const blob = new Blob([dummyContent], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          setCompletedResult({
            fileName: outName,
            fileSize: '1.2 MB',
            downloadUrl: url,
            conversionRecord: record,
          });
        }, 500);
      }
    }, 450);
  };

  // Reset workstation
  const handleResetWorkstation = () => {
    setStagedFiles([]);
    setCompletedResult(null);
    setIsProcessing(false);
    setProcessProgress(0);
  };

  /* ========================================================
   * RENDER: TOOL WORKSTATION VIEW
   * ======================================================== */
  if (currentTool) {
    return (
      <div className="max-w-6xl mx-auto py-6 flex flex-col gap-6 animate-in fade-in-50">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <button
            onClick={() => {
              onSelectTool(undefined as any);
              handleResetWorkstation();
            }}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#E5322D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All PDF Tools</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="hidden sm:inline">Zero-Retention Buffer</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 font-bold">100% Client-Side Private</span>
          </div>
        </div>

        {/* WORKSTATION VIEW: COMPLETED RESULT SCREEN */}
        {completedResult ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8 sm:p-12 shadow-md flex flex-col items-center text-center max-w-2xl mx-auto w-full transition-colors">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800/60">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              THE FILE HAS BEEN CONVERTED!
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 max-w-md">
              Processed in RAM with zero disk footprints. Ready for immediate download or encrypted vault synchronization.
            </p>

            <div className="my-6 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono-code text-gray-700 dark:text-slate-200 flex items-center justify-between gap-4 w-full max-w-md">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate font-semibold">{completedResult.fileName}</span>
              </div>
              <span className="text-gray-500 dark:text-slate-400 shrink-0">{completedResult.fileSize}</span>
            </div>

            {/* Giant Red Download Button (iLovePDF signature) */}
            <a
              href={completedResult.downloadUrl}
              download={completedResult.fileName}
              className="w-full max-w-md py-4 px-6 rounded-xl bg-[#E5322D] hover:bg-[#c62828] text-white text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group"
            >
              <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
              <span>Download converted PDF</span>
            </a>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-4">
              <button
                onClick={() => onSaveToVault(completedResult.conversionRecord)}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                <span>Save to Vault</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                <span>QR Code</span>
              </button>

              <button
                onClick={handleResetWorkstation}
                className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-[#E5322D] dark:hover:text-[#EF4444] text-gray-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Shred & Repeat</span>
              </button>
            </div>

            {/* Continue with other tools */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 w-full flex flex-col items-center">
              <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Continue with another tool
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => {
                    onSelectTool('compress-pdf');
                    handleResetWorkstation();
                  }}
                  className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 text-gray-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  Compress PDF
                </button>
                <button
                  onClick={() => {
                    onSelectTool('watermark-pdf');
                    handleResetWorkstation();
                  }}
                  className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-400 text-gray-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  Watermark PDF
                </button>
                <button
                  onClick={() => {
                    onSelectTool('protect-pdf');
                    handleResetWorkstation();
                  }}
                  className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#E5322D] dark:hover:text-[#EF4444] text-gray-700 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  Protect with Password
                </button>
              </div>
            </div>
          </div>
        ) : isProcessing ? (
          /* PROCESSING SCREEN */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 shadow-md flex flex-col items-center text-center max-w-xl mx-auto w-full transition-colors">
            <RefreshCw className="w-12 h-12 text-[#E5322D] animate-spin mb-6" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Processing your files...
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-mono-code">
              {processStage}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full mt-6 overflow-hidden">
              <div 
                className="bg-[#E5322D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${processProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono-code font-bold text-gray-700 dark:text-slate-300 mt-2">
              {processProgress}%
            </span>
          </div>
        ) : stagedFiles.length === 0 ? (
          /* STEP 1: UPLOAD DROPZONE (iLovePDF Style) */
          <div className="flex flex-col items-center text-center py-10 sm:py-16">
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: currentTool.bgColor }}
              >
                <ToolIcon iconName={currentTool.iconName} color={currentTool.iconColor} className="w-7 h-7" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {currentTool.title}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base max-w-lg mt-2 leading-relaxed">
              {currentTool.description}
            </p>

            {/* Drop Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full max-w-3xl mt-8 rounded-3xl border-2 border-dashed p-10 sm:p-14 flex flex-col items-center justify-center gap-6 transition-all ${
                isDragging 
                  ? 'border-[#E5322D] bg-red-50/50 dark:bg-red-950/20 scale-[1.01]' 
                  : 'border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-gray-400 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept={currentTool.accept}
                onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
                className="hidden"
              />

              {/* The Famous Big Red iLovePDF Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#E5322D] hover:bg-[#c62828] text-white text-xl sm:text-2xl font-bold py-5 px-10 sm:px-14 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3.5 group"
              >
                <UploadCloud className="w-7 h-7 group-hover:-translate-y-0.5 transition-transform" />
                <span>{currentTool.selectButtonText}</span>
              </button>

              {/* Cloud & Vault Selectors */}
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <button
                  onClick={() => setIsVaultPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-slate-200 transition-colors"
                  title="Select from Encrypted Vault"
                >
                  <Lock className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
                  <span>Choose from Vault ({vaultFiles.length})</span>
                </button>

                <button
                  onClick={() => {
                    // Demo load sample file
                    setStagedFiles([
                      {
                        id: 'demo-1',
                        name: currentTool.id === 'jpg-to-pdf' ? 'receipt_scan.png' : 'financial_report.docx',
                        size: '2.4 MB',
                        rotation: 0,
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors"
                >
                  Load Sample Document
                </button>
              </div>

              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                or drop files here
              </span>
            </div>

            {/* Privacy Guarantee Strip */}
            <div className="flex items-center gap-4 mt-8 text-xs text-gray-500 dark:text-slate-400 font-mono-code flex-wrap justify-center">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Server Retention</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Client-Side RAM Isolation</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>100% Free & Unlimited</span>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: STAGED FILES WORKSPACE & RIGHT-HAND OPTIONS SIDEBAR */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Document / Pages Stage */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                    Staged Files ({stagedFiles.length})
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500 font-mono-code">
                    Drag or rotate pages
                  </span>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-bold text-[#E5322D] dark:text-[#EF4444] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add more files</span>
                </button>
              </div>

              {/* Grid of Pages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 min-h-[360px]">
                {stagedFiles.map((file, idx) => (
                  <div
                    key={file.id}
                    className="relative bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-3 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
                  >
                    {/* Top action controls */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-[10px] font-mono-code text-gray-600 dark:text-slate-300 font-bold">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRotatePage(file.id)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(file.id)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail preview */}
                    <div className="h-40 bg-gray-100 dark:bg-slate-800/80 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {file.previewUrl ? (
                        <img
                          src={file.previewUrl}
                          alt={file.name}
                          style={{ transform: `rotate(${file.rotation}deg)` }}
                          className="object-contain max-h-full transition-transform duration-300"
                        />
                      ) : (
                        <div 
                          style={{ transform: `rotate(${file.rotation}deg)` }}
                          className="flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 gap-1.5 transition-transform duration-300"
                        >
                          <FileText className="w-10 h-10 text-gray-400 dark:text-slate-500" />
                          <span className="text-[10px] font-mono-code text-gray-500 dark:text-slate-400 uppercase">
                            {file.name.split('.').pop() || 'DOC'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom filename badge */}
                    <div className="mt-2 flex flex-col">
                      <span className="text-xs font-medium text-gray-800 dark:text-slate-200 truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono-code">
                        {file.size}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add more files card */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full min-h-[220px] rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-800 hover:border-[#E5322D] dark:hover:border-[#EF4444] hover:bg-red-50/20 dark:hover:bg-red-950/20 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-500 hover:text-[#E5322D] dark:hover:text-[#EF4444] transition-colors"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-xs font-bold">Add files</span>
                </button>
              </div>
            </div>

            {/* Right: The Famous iLovePDF Options Sidebar */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-5 sticky top-24 transition-colors">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#E5322D]" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {currentTool.shortTitle} Options
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-slate-500 font-mono-code uppercase">Settings</span>
              </div>

              {/* Specific options depending on tool */}
              {(currentTool.id === 'jpg-to-pdf' || currentTool.id === 'word-to-pdf') && (
                <>
                  {/* Orientation */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                      Page Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrientation('Portrait')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          orientation === 'Portrait'
                            ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] dark:border-red-600'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>📄 Portrait</span>
                      </button>
                      <button
                        onClick={() => setOrientation('Landscape')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          orientation === 'Landscape'
                            ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] dark:border-red-600'
                            : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>📃 Landscape</span>
                      </button>
                    </div>
                  </div>

                  {/* Page Margin */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                      Margin
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['No margin', 'Small', 'Big'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMargin(m as any)}
                          className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${
                            margin.includes(m) || (m === 'Small' && margin.includes('Compact')) || (m === 'Big' && margin.includes('Legal'))
                              ? 'border-[#E5322D] bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] font-bold'
                              : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Merge all into one PDF */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 cursor-pointer">
                    <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">
                      Merge all files into one PDF
                    </span>
                    <input
                      type="checkbox"
                      checked={mergeAll}
                      onChange={(e) => setMergeAll(e.target.checked)}
                      className="w-4 h-4 text-[#E5322D] rounded focus:ring-[#E5322D]"
                    />
                  </label>
                </>
              )}

              {/* Compression specific options */}
              {currentTool.id === 'compress-pdf' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                    Compression Level
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'Web Optimized', title: 'Extreme Compression', desc: 'Less quality, high compression' },
                      { id: 'High Quality', title: 'Recommended Compression', desc: 'Good quality, good compression' },
                      { id: 'Lossless Strict', title: 'Less Compression', desc: 'High quality, less compression' },
                    ].map((comp) => (
                      <button
                        key={comp.id}
                        onClick={() => setCompressionLevel(comp.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          compressionLevel === comp.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 dark:border-emerald-600'
                            : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{comp.title}</span>
                          {comp.id === 'High Quality' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 block mt-0.5">{comp.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Watermark specific options */}
              {currentTool.id === 'watermark-pdf' && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="CONFIDENTIAL"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg text-xs font-mono-code focus:outline-none focus:border-[#E5322D]"
                  />

                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide mt-1">
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-lg w-28 mx-auto">
                    {['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setWatermarkPosition(pos)}
                        className={`w-7 h-7 rounded text-[10px] font-mono-code flex items-center justify-center ${
                          watermarkPosition === pos ? 'bg-[#E5322D] text-white font-bold' : 'text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                      >
                        •
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Password protect options */}
              {currentTool.id === 'protect-pdf' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wide">
                    Set Document Password
                  </label>
                  <input
                    type="password"
                    value={passwordProtection}
                    onChange={(e) => setPasswordProtection(e.target.value)}
                    placeholder="Enter passphrase"
                    className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg text-xs font-mono-code focus:outline-none focus:border-[#E5322D]"
                  />
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">
                    Encrypted with Hardware AES-256 GCM prior to RAM serialization.
                  </span>
                </div>
              )}

              {/* Zero retention guarantee indicator */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300 font-medium">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="leading-tight text-[11px]">
                  Files shredded automatically upon conversion. 0-byte server retention.
                </span>
              </div>

              {/* Big Red Conversion Button */}
              <button
                onClick={handleRunConversion}
                className="w-full py-4 rounded-xl bg-[#E5322D] hover:bg-[#c62828] text-white text-base font-bold shadow-lg hover:shadow-xl hover:shadow-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{currentTool.actionButtonText}</span>
              </button>
            </div>
          </div>
        )}

        {/* Vault Picker Modal */}
        {isVaultPickerOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#E5322D]" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">Select from Encrypted Vault</span>
                </div>
                <button
                  onClick={() => setIsVaultPickerOpen(false)}
                  className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                {vaultFiles.map((vf) => (
                  <button
                    key={vf.id}
                    onClick={() => {
                      setStagedFiles((prev) => [
                        ...prev,
                        {
                          id: `v-${Date.now()}`,
                          name: vf.name,
                          size: vf.size,
                          rotation: 0,
                        },
                      ]);
                      setIsVaultPickerOpen(false);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-[#E5322D] dark:hover:border-[#EF4444] hover:bg-red-50/30 dark:hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">{vf.name}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-slate-500 font-mono-code shrink-0">{vf.size}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QR Code Modal */}
        {showQrModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center text-center gap-4">
              <span className="font-bold text-base text-gray-900 dark:text-white">Download on Mobile</span>
              <div className="p-4 bg-gray-50 dark:bg-white rounded-xl">
                <img
                  alt="QR Code"
                  className="w-44 h-44 object-contain"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://phantom.internal/share/demo-link')}`}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-mono-code">
                Scan with your phone to receive the decrypted PDF directly into device memory.
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ========================================================
   * RENDER: iLovePDF TOOLS HUB & HOMEPAGE VIEW
   * ======================================================== */
  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 flex flex-col gap-10">
      {/* Hero Headline */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        <div className="mb-5 inline-flex flex-col items-center">
          <div className="p-2.5 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <PhantomLogo size="md" showText={true} subtitle={true} separateWords={true} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 mt-4 leading-relaxed font-normal max-w-2xl">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock, and watermark PDFs with client-side zero-retention.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md mt-6 relative">
          <Search className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search tools (e.g. compress, merge, word)..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm shadow-sm focus:outline-none focus:border-[#E5322D] focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/30 transition-all"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills (iLovePDF Style) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gray-900 dark:bg-[#E5322D] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* The Signature iLovePDF Multi-Colored Tool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 sm:px-0">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200/90 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top row: Icon and Badge */}
            <div>
              <div className="flex items-center justify-between">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: tool.bgColor }}
                >
                  <ToolIcon iconName={tool.iconName} color={tool.iconColor} className="w-6 h-6" />
                </div>

                {tool.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tool.badge === 'Popular'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-red-100 dark:bg-red-950/60 text-[#E5322D] dark:text-[#EF4444]'
                  }`}>
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-[#E5322D] dark:group-hover:text-[#EF4444] transition-colors mt-4">
                {tool.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            {/* Subtle bottom hover bar */}
            <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-[#E5322D] dark:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open tool</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Conversions Strip (If any) */}
      {recentConversions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm mx-4 sm:mx-0 flex flex-col gap-4 transition-colors">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-sm text-gray-900 dark:text-white">Recent Ephemeral Conversions</span>
            </div>
            <button
              onClick={onOpenAuditSession}
              className="text-xs font-semibold text-[#E5322D] dark:text-[#EF4444] hover:underline"
            >
              View Audit Ledger →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentConversions.slice(0, 3).map((conv) => (
              <div
                key={conv.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-gray-800 dark:text-slate-200 truncate">{conv.outputFile}</span>
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 font-mono-code">{conv.engine} • {conv.timeAgo}</span>
                </div>
                <button
                  onClick={() => onSaveToVault(conv)}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 font-medium shrink-0 transition-colors"
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust & Security Banner (iLovePDF Style) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8 shadow-sm mx-4 sm:mx-0 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-[#E5322D] dark:text-[#EF4444] flex items-center justify-center mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Zero Server Retention</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
              All files are processed in ephemeral V8 memory sandboxes and completely purged on download.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Hardware AES-256 GCM</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
              Every document payload is sealed with hardware-enclave keys before client dispatch.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">100% Free & Uncapped</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs">
              Convert, merge, split, and protect documents without artificial page limits or queues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
