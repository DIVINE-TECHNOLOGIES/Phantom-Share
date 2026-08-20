# Phantom-Share

A secure file management and sharing web application — upload, convert, zip, and share files through password-protected, expiring links.

## Features

**Auth & Accounts**
- Registration, login, logout
- Email verification on signup
- Forgot password / reset password flow
- Role-based access (User / Admin)

**File Management**
- Drag-and-drop upload and download
- Combine multiple files into a single ZIP
- Extract (unzip) uploaded archives
- File type & size validation on upload
- Files encrypted at rest (AES-256)

**File Conversion**
- JPG ↔ PNG
- DOCX → PDF
- Images → PDF
- TXT → PDF

**Secure Sharing**
- Unique shareable links per file
- Optional password protection on links
- Configurable link expiry (1 hour / 1 day / 7 days)
- Configurable max download count
- Revoke/delete a link at any time

**History & Admin**
- Per-user upload/download/share activity log
- Admin panel: storage usage stats across users
- Scheduled job to auto-delete expired files and links

## Tech Stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Framework  | Next.js 15 (App Router, full-stack)       |
| Database   | PostgreSQL                                |
| ORM        | Prisma                                    |
| Auth       | JWT (custom) + bcrypt for password hashing|
| Styling    | Tailwind CSS                              |
| File ops   | archiver, unzipper, sharp, pdf-lib, libreoffice-convert |
| Email      | nodemailer (SMTP)                         |

## Project Structure

```
phantom-share/
├── app/
│   ├── api/
│   │   ├── auth/           # register, login, verify-email, forgot/reset password
│   │   ├── files/          # upload, download, convert, zip
│   │   ├── share/          # create/access/revoke share links
│   │   └── admin/          # admin-only stats & management endpoints
│   ├── dashboard/          # user dashboard UI
│   ├── login/ register/    # auth pages
│   ├── share/[token]/      # public link-access page
│   └── admin/              # admin panel UI
├── components/             # shared UI components (Dropzone, FileCard, etc.)
├── lib/                    # auth helpers, encryption, storage, email, validation
├── prisma/
│   └── schema.prisma       # User, File, ShareLink, ActivityLog models
├── public/uploads/         # local file storage (dev only)
└── .env.example
```

## Data Model (high level)

- **User** — account, role, email verification & reset tokens
- **File** — owned files, encryption flag, optional expiry
- **ShareLink** — token, optional password hash, expiry, download limit/count, revoked flag
- **ActivityLog** — upload/download/share/convert/zip events per user

See `prisma/schema.prisma` for full field definitions.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # fill in DATABASE_URL, JWT_SECRET, SMTP_*, FILE_ENCRYPTION_KEY, etc.
   ```

3. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

## Security Notes

- Files are encrypted at rest using AES-256; `FILE_ENCRYPTION_KEY` must be a 64-char hex string (32 bytes).
- Share link passwords are hashed with bcrypt, never stored in plaintext.
- Expired files/links are purged by a scheduled cleanup job (cron or serverless scheduled function) — see `lib/cleanup.ts` (to be implemented).
- All uploads are validated for MIME type and size before being written to storage.

## Roadmap / Not Yet Implemented

- [ ] S3-compatible storage driver (currently local disk only)
- [ ] Rate limiting on auth and share-link endpoints
- [ ] Virus scanning on upload (e.g. ClamAV integration)
- [ ] Two-factor authentication

## License

Private project — all rights reserved.
