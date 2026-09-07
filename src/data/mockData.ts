import { VaultFile, ConversionRecord, SharedLink, AuditLogEntry, WorkerNode } from '../types';

export const INITIAL_VAULT_FILES: VaultFile[] = [
  {
    id: 'vf-1',
    name: 'Q1_Financial_Forecast.docx',
    extension: 'docx',
    size: '2.4 MB',
    sizeBytes: 2516582,
    sha256: '8f4e912b7a0d1e56c18b44918ef9a023b198fa10984ee2c398bc019284fa9812',
    encryption: 'Hardware AES-GCM-256',
    classification: 'CONFIDENTIAL',
    uploadedAt: 'Today, 06:42 AM',
    status: 'Decrypted in RAM',
    source: 'Secure Vault',
    contentPreview: 'EXECUTIVE SUMMARY: Q1 Financial projections show 42% ARR growth across privacy and sovereign cloud nodes with zero unencrypted retention...'
  },
  {
    id: 'vf-2',
    name: 'screenshot_terminal_log.png',
    extension: 'png',
    size: '1.8 MB',
    sizeBytes: 1887436,
    sha256: '3c89f1092a0de783b2719281ff00928374a12903847291823901928374619283',
    encryption: 'Hardware AES-GCM-256',
    classification: 'RESTRICTED',
    uploadedAt: 'Today, 07:08 AM',
    status: 'Encrypted at Rest',
    source: 'Ephemeral Dropzone'
  },
  {
    id: 'vf-3',
    name: 'executive_brief.txt',
    extension: 'txt',
    size: '142 KB',
    sizeBytes: 145408,
    sha256: '9a0182746182903847192837461928374a918273645192837465019283746192',
    encryption: 'XChaCha20-Poly1305',
    classification: 'CONFIDENTIAL',
    uploadedAt: 'Today, 06:59 AM',
    status: 'Encrypted at Rest',
    source: 'RAM Staging'
  },
  {
    id: 'vf-4',
    name: 'raw_scans_bundle.tar.gz',
    extension: 'tar.gz',
    size: '8.4 MB',
    sizeBytes: 8808038,
    sha256: '11fe9028374619283746192837461928374a9182736451928374650192837461',
    encryption: 'Hardware AES-GCM-256',
    classification: 'TOP SECRET',
    uploadedAt: 'Today, 06:43 AM',
    status: 'Encrypted at Rest',
    source: 'Encrypted USB Ingestion'
  },
  {
    id: 'vf-5',
    name: 'zero_knowledge_audit_v4.pdf',
    extension: 'pdf',
    size: '4.1 MB',
    sizeBytes: 4300000,
    sha256: '72aa091827364519283746501928374619283746192837461928374619283746',
    encryption: 'Hardware AES-GCM-256',
    classification: 'CONFIDENTIAL',
    uploadedAt: 'Yesterday, 04:15 PM',
    status: 'Encrypted at Rest',
    source: 'Compliance Attestation'
  },
  {
    id: 'vf-6',
    name: 'root_ca_intermediate.pem',
    extension: 'pem',
    size: '48 KB',
    sizeBytes: 49152,
    sha256: 'bb49019283746192837465019283746192837461928374619283746192837461',
    encryption: 'Hardware AES-GCM-256',
    classification: 'TOP SECRET',
    uploadedAt: 'Yesterday, 01:20 PM',
    status: 'Encrypted at Rest',
    source: 'Air-Gapped HSM'
  },
  {
    id: 'vf-7',
    name: 'architecture_diagram_v2.svg',
    extension: 'svg',
    size: '950 KB',
    sizeBytes: 972800,
    sha256: 'c091827364519283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'INTERNAL',
    uploadedAt: 'Sep 05, 11:30 AM',
    status: 'Encrypted at Rest',
    source: 'Design Sync'
  },
  {
    id: 'vf-8',
    name: 'transient_worker_keys.json',
    extension: 'json',
    size: '24 KB',
    sizeBytes: 24576,
    sha256: 'ff01928374619283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'TOP SECRET',
    uploadedAt: 'Sep 05, 09:12 AM',
    status: 'Encrypted at Rest',
    source: 'Key Manager'
  },
  {
    id: 'vf-9',
    name: 'board_presentation_draft.pptx',
    extension: 'pptx',
    size: '12.6 MB',
    sizeBytes: 13212057,
    sha256: 'e501928374619283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'CONFIDENTIAL',
    uploadedAt: 'Sep 04, 05:22 PM',
    status: 'Encrypted at Rest',
    source: 'Secure Vault'
  },
  {
    id: 'vf-10',
    name: 'kubernetes_secrets_manifest.yaml',
    extension: 'yaml',
    size: '88 KB',
    sizeBytes: 90112,
    sha256: 'a201928374619283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'TOP SECRET',
    uploadedAt: 'Sep 03, 02:45 PM',
    status: 'Encrypted at Rest',
    source: 'DevSecOps Sync'
  },
  {
    id: 'vf-11',
    name: 'penetration_test_findings.docx',
    extension: 'docx',
    size: '3.1 MB',
    sizeBytes: 3250585,
    sha256: '6701928374619283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'TOP SECRET',
    uploadedAt: 'Sep 02, 10:14 AM',
    status: 'Encrypted at Rest',
    source: 'Red Team Audit'
  },
  {
    id: 'vf-12',
    name: 'disaster_recovery_playbook.md',
    extension: 'md',
    size: '310 KB',
    sizeBytes: 317440,
    sha256: '4401928374619283746501928374619283746192837461928374619283746192',
    encryption: 'Hardware AES-GCM-256',
    classification: 'INTERNAL',
    uploadedAt: 'Sep 01, 08:00 AM',
    status: 'Encrypted at Rest',
    source: 'Operations Portal'
  }
];

export const INITIAL_RECENT_CONVERSIONS: ConversionRecord[] = [
  {
    id: 'conv-1',
    sourceFile: 'screenshot_terminal_log.png',
    outputFile: 'screenshot_terminal_log.jpg',
    timeAgo: '3 mins ago',
    engine: 'Sharp v0.33',
    badge: 'Reduced 62%',
    badgeColor: 'primary',
    isVaultSaved: true,
    timestamp: Date.now() - 3 * 60 * 1000
  },
  {
    id: 'conv-2',
    sourceFile: 'executive_brief.txt',
    outputFile: 'executive_brief.pdf',
    timeAgo: '12 mins ago',
    engine: 'pdf-lib Engine',
    badge: 'Rendered 2 pages',
    badgeColor: 'secondary',
    isVaultSaved: true,
    timestamp: Date.now() - 12 * 60 * 1000
  },
  {
    id: 'conv-3',
    sourceFile: 'raw_scans_bundle (4 images)',
    outputFile: 'scans_merged.pdf',
    timeAgo: '28 mins ago',
    engine: 'pdf-lib WASM',
    badge: '8.4 MB (lossless)',
    badgeColor: 'outline',
    isVaultSaved: true,
    timestamp: Date.now() - 28 * 60 * 1000
  }
];

export const INITIAL_SHARED_LINKS: SharedLink[] = [
  {
    id: 'sl-1',
    fileName: 'Q1_Financial_Forecast.pdf',
    fileSize: '1.4 MB',
    sha256: '92bf...33a1',
    url: 'https://phantom.internal/share/89a4-ff12-e2ee',
    ttlSeconds: 894, // ~14m 54s
    readsRemaining: 1,
    maxReads: 1,
    hasPassphrase: true,
    classification: 'CONFIDENTIAL',
    isExpired: false
  },
  {
    id: 'sl-2',
    fileName: 'executive_brief.pdf',
    fileSize: '142 KB',
    sha256: 'c4e1...881f',
    url: 'https://phantom.internal/share/31ba-00cd-e2ee',
    ttlSeconds: 7420, // ~2h 3m
    readsRemaining: 2,
    maxReads: 5,
    hasPassphrase: true,
    classification: 'CONFIDENTIAL',
    isExpired: false
  },
  {
    id: 'sl-3',
    fileName: 'root_ca_certificate.pem',
    fileSize: '48 KB',
    sha256: 'ee98...7710',
    url: 'https://phantom.internal/share/0912-bb44-e2ee',
    ttlSeconds: 310, // ~5m 10s
    readsRemaining: 1,
    maxReads: 1,
    hasPassphrase: true,
    classification: 'TOP SECRET',
    isExpired: false
  },
  {
    id: 'sl-4',
    fileName: 'penetration_test_findings.docx',
    fileSize: '3.1 MB',
    sha256: '419a...ff01',
    url: 'https://phantom.internal/share/7702-88aa-e2ee',
    ttlSeconds: 18450, // ~5h 7m
    readsRemaining: 3,
    maxReads: 3,
    hasPassphrase: false,
    classification: 'RESTRICTED',
    isExpired: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '07:11:45.102',
    blockHash: '0x98a44bc1982ea012...',
    prevBlockHash: '0x81fa00cd77651092...',
    action: 'CONVERSION_RAM',
    operator: 'Sarah Jenkins (UID: sec-082)',
    details: 'DOCX->PDF executed via isolated worker lo-8092. Memory mapped at 0x7fff4010.',
    node: 'worker-node-01'
  },
  {
    id: 'log-2',
    timestamp: '07:11:46.044',
    blockHash: '0x12bb9934fa771928...',
    prevBlockHash: '0x98a44bc1982ea012...',
    action: 'BUFFER_SHRED',
    operator: 'Kernel Crypto-Shredder',
    details: 'Zeroized 2,516,582 bytes unencrypted heap buffer using DOD 5220.22-M 7-pass.',
    node: 'worker-node-01'
  },
  {
    id: 'log-3',
    timestamp: '07:11:46.120',
    blockHash: '0x44cd881028736451...',
    prevBlockHash: '0x12bb9934fa771928...',
    action: 'VAULT_ENCRYPT',
    operator: 'Hardware HSM-KMS',
    details: 'Output stream encrypted with Vault public key RSA-4096 / AES-GCM-256.',
    node: 'vault-daemon-01'
  },
  {
    id: 'log-4',
    timestamp: '07:08:12.890',
    blockHash: '0x7701928374651092...',
    prevBlockHash: '0x44cd881028736451...',
    action: 'LINK_ZEROIZE',
    operator: 'Auto-TTL Daemon',
    details: 'Ephemeral link token 89a4-burn-1 reached 0 reads remaining. Burn-on-read completed.',
    node: 'ephemeral-proxy-04'
  },
  {
    id: 'log-5',
    timestamp: '06:55:01.002',
    blockHash: '0x3341829038471928...',
    prevBlockHash: '0x7701928374651092...',
    action: 'KEY_ATTESTATION',
    operator: 'Secure Enclave v8',
    details: 'Attested PCR registers 0-7: zero tampering detected in WASM sandbox microservices.',
    node: 'enclave-v8-alpha'
  }
];

export const WORKER_NODES: WorkerNode[] = [
  {
    id: 'wn-1',
    name: 'transient-lo-8092',
    status: 'Ephemeral Active',
    assignedTask: 'DOCX Document to PDF (LibreOffice C++)',
    memoryUsage: '124 MB / 1024 MB',
    uptime: '14m 20s',
    latencyMs: 84
  },
  {
    id: 'wn-2',
    name: 'transient-vips-8093',
    status: 'Ephemeral Active',
    assignedTask: 'Sharp libvips Lossless Stream Engine',
    memoryUsage: '68 MB / 512 MB',
    uptime: '42m 11s',
    latencyMs: 42
  },
  {
    id: 'wn-3',
    name: 'transient-pdfwasm-8094',
    status: 'Ephemeral Active',
    assignedTask: 'pdf-lib Sandboxed WASM Collation',
    memoryUsage: '92 MB / 1024 MB',
    uptime: '1h 05m',
    latencyMs: 110
  },
  {
    id: 'wn-4',
    name: 'transient-shredder-8095',
    status: 'Ephemeral Active',
    assignedTask: 'DOD 5220.22-M Low-Level Crypto Shredder',
    memoryUsage: '14 MB / 256 MB',
    uptime: '3h 18m',
    latencyMs: 8
  }
];
