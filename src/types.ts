export type NavigationTab = 
  | 'file-converter'
  | 'vault-and-files'
  | 'shared-links-and-expiring'
  | 'audit-and-activity-log'
  | 'admin-console';

export type PDFToolCategory = 
  | 'All'
  | 'Organize PDF'
  | 'Optimize PDF'
  | 'Convert to PDF'
  | 'Convert from PDF'
  | 'Edit & Security';

export type PDFToolId = 
  | 'merge-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'pdf-to-powerpoint'
  | 'powerpoint-to-pdf'
  | 'pdf-to-excel'
  | 'excel-to-pdf'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  | 'sign-pdf'
  | 'watermark-pdf'
  | 'rotate-pdf'
  | 'html-to-pdf'
  | 'unlock-pdf'
  | 'protect-pdf'
  | 'organize-pdf'
  | 'page-numbers'
  | 'ocr-pdf';

export interface PDFTool {
  id: PDFToolId;
  title: string;
  shortTitle: string;
  description: string;
  category: PDFToolCategory;
  badge?: string;
  iconName: string;
  iconColor: string;
  bgColor: string;
  accept: string;
  selectButtonText: string;
  actionButtonText: string;
}

export type ConversionMode = 'JPG / PNG' | 'DOCX → PDF' | 'Img Collate' | 'TXT → PDF';

export type PageMargin = 
  | 'Standard (0.75 in / 19mm)'
  | 'Compact Print (0.4 in / 10mm)'
  | 'Zero Margin (Full Bleed Content)'
  | 'Legal Standard (1.0 in / 25.4mm)';

export type Orientation = 'Portrait' | 'Landscape';

export type CompressionLevel = 'Lossless Strict' | 'High Quality' | 'Web Optimized';

export interface VaultFile {
  id: string;
  name: string;
  extension: string;
  size: string;
  sizeBytes: number;
  sha256: string;
  encryption: string;
  classification: 'TOP SECRET' | 'CONFIDENTIAL' | 'RESTRICTED' | 'INTERNAL';
  uploadedAt: string;
  status: 'Encrypted at Rest' | 'Decrypted in RAM' | 'Ephemeral Sync';
  source: string;
  contentPreview?: string;
}

export interface ConversionRecord {
  id: string;
  sourceFile: string;
  outputFile: string;
  timeAgo: string;
  engine: string;
  badge: string;
  badgeColor?: 'primary' | 'secondary' | 'outline';
  isVaultSaved: boolean;
  timestamp: number;
}

export interface SharedLink {
  id: string;
  fileName: string;
  fileSize: string;
  sha256: string;
  url: string;
  ttlSeconds: number;
  readsRemaining: number;
  maxReads: number;
  hasPassphrase: boolean;
  classification: string;
  isExpired: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  blockHash: string;
  prevBlockHash: string;
  action: 'CONVERSION_RAM' | 'BUFFER_SHRED' | 'VAULT_ENCRYPT' | 'LINK_ZEROIZE' | 'KEY_ATTESTATION';
  operator: string;
  details: string;
  node: string;
}

export interface WorkerNode {
  id: string;
  name: string;
  status: 'Ephemeral Active' | 'Standby' | 'Shredding';
  assignedTask: string;
  memoryUsage: string;
  uptime: string;
  latencyMs: number;
}
