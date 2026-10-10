# SIPERPUS-REPO - Project Context & Next Steps

This document provides a complete overview of the **SIPERPUS** (Sistem Informasi Perpustakaan Politeknik Negeri Lhokseumawe) application for AI models (Gemini CLI, OpenCode, Antigravity) and human developers.

---

## 1. Project Overview & Tech Stack
- **Framework:** React 19 + TypeScript (via Vite 8)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Package Manager / Runtime:** `npm` (Node v20+)
- **Build / Lint Verification:**
  - TypeScript: `npx tsc --noEmit`
  - Vite Build: `npm run build`
  - Dev Server: `npm run dev`

---

## 2. Current Architecture & File Structure

The project has undergone a complete **Phase 1 Modularization** (all giant monolithic files were dismantled into clean, maintainable components):

```
src/
├── components/
│   ├── Navigation.tsx        # Top navbar & mobile drawer
│   ├── Footer.tsx            # Footer component
│   └── ui/                   # Reusable UI primitives (Button, Modal, Card, Stat, Badge, etc.)
│
├── pages/                    # Views and sub-views
│   ├── LandingPage.tsx       # Landing page (Hero, Stats, Featured, E-Repo preview, Testimonials)
│   ├── CatalogPage.tsx       # Public/Student physical catalog & BooksView
│   ├── RepositoryPage.tsx    # E-Repository search & RepositoryView
│   ├── HelpPage.tsx          # FAQ & contact info
│   │
│   ├── StudentDashboard.tsx  # Student Portal - Main Dashboard
│   ├── StudentCirculation.tsx# Student Portal - Active loans & hold history
│   ├── StudentERepo.tsx      # Student Portal - Upload and track thesis/papers
│   ├── StudentFines.tsx      # Student Portal - Fine overview, status Bebas Pustaka
│   ├── StudentShared.tsx     # Student Portal - Shared layout atoms and icons
│   ├── QrisMock.tsx          # QRIS payment modal simulation
│   │
│   ├── LibrarianDashboard.tsx # Librarian Portal - Metrics & operational summary
│   ├── LibrarianSirkulasi.tsx # Librarian Portal - Desk desk / NIM lookup & hold handovers
│   ├── LibrarianFines.tsx     # Librarian Portal - QRIS proof verification & clearance
│   ├── LibrarianCuration.tsx  # Librarian Portal - Paper curation (approve/revise)
│   ├── LibrarianCatalog.tsx   # Librarian Portal - Book list & stock manager
│   ├── LibrarianBookForm.tsx  # Librarian Portal - Add/edit book modal
│   └── LibrarianShared.tsx    # Librarian Portal - Shared layout atoms, metrics, and icons
│
├── data/
│   ├── mockData.ts           # Public catalog books, e-repository papers, FAQ data
│   ├── portalData.ts         # Student portal initial mock data
│   └── librarianData.ts      # Librarian portal initial mock data & helper functions
│
├── types/
│   └── index.ts              # Core shared TypeScript types (Book, RepositoryItem, etc.)
│
├── App.tsx                   # Top-level router / view switcher (Landing, Catalog, Repo, Student, Librarian)
├── StudentPortal.tsx         # Shell & state container for Student Portal
├── LibrarianPortal.tsx       # Shell & state container for Librarian Portal
└── main.tsx                  # App entrypoint
```

---

## 3. Progress Tracking

### Phase 1: Modularization & Decoupling (COMPLETE)
- [x] Removed Figma Make specific dependencies and HTML tags.
- [x] Initialized Git repository with clean commits.
- [x] Split `App.tsx` into modular UI primitives (`components/ui/`) and standalone pages (`pages/`).
- [x] Split `StudentPortal.tsx` into modular sub-views (`StudentDashboard`, `StudentCirculation`, `StudentERepo`, `StudentFines`).
- [x] Split `LibrarianPortal.tsx` into modular sub-views (`LibrarianDashboard`, `LibrarianSirkulasi`, `LibrarianFines`, `LibrarianCuration`, `LibrarianCatalog`, `LibrarianBookForm`).
- [x] Zero TypeScript errors (`npx tsc --noEmit` passes).
- [x] Production build passes (`npm run build` outputs clean bundle).

---

## 4. Phase 2: Supabase Integration Plan (UPCOMING)

When continuing this project, Phase 2 replaces client-side mock states with real Supabase persistence and authentication.

### Recommended Supabase Database Schema

1. **`profiles`**
   - `id`: UUID (references `auth.users`)
   - `nim`: text / varchar (unique, e.g. "2101020045")
   - `full_name`: text
   - `role`: enum (`student`, `librarian`)
   - `prodi`: text
   - `clear_status`: boolean (Status Bebas Pustaka)

2. **`books`**
   - `id`: uuid / int
   - `code`: text unique (e.g. "INF-042")
   - `title`: text
   - `author`: text
   - `category`: text
   - `year`: int
   - `stock`: int
   - `shelf`: text (e.g. "Rak A-03")
   - `cover_url`: text

3. **`holds`** (Reservasi Buku)
   - `id`: uuid
   - `user_id`: uuid (references `profiles.id`)
   - `book_id`: uuid (references `books.id`)
   - `pin`: text (e.g. "PNL-HOLD-8921")
   - `status`: enum (`active`, `collected`, `expired`, `cancelled`)
   - `expires_at`: timestamptz

4. **`loans`** (Peminjaman Aktif & Histori)
   - `id`: uuid
   - `user_id`: uuid (references `profiles.id`)
   - `book_id`: uuid (references `books.id`)
   - `borrowed_at`: timestamptz
   - `due_date`: timestamptz
   - `returned_at`: timestamptz (nullable)
   - `status`: enum (`borrowed`, `returned`, `overdue`)

5. **`fines`** (Denda Keterlambatan & Pembayaran QRIS)
   - `id`: uuid
   - `user_id`: uuid (references `profiles.id`)
   - `loan_id`: uuid (references `loans.id`)
   - `amount`: numeric / bigint
   - `days_late`: int
   - `status`: enum (`unpaid`, `pending_verification`, `paid`)
   - `receipt_url`: text (Storage bucket path for QRIS payment proof)
   - `verified_at`: timestamptz
   - `verified_by`: uuid (references `profiles.id`)

6. **`repository_items`** (Koleksi Skripsi & Jurnal)
   - `id`: uuid
   - `title`: text
   - `author_id`: uuid (references `profiles.id`)
   - `prodi`: text
   - `year`: int
   - `abstract`: text
   - `pdf_url`: text
   - `status`: enum (`pending_curation`, `published`, `revision_needed`)
   - `reviewer_notes`: text

---

## 5. Next Steps for Developer / AI

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Create `src/lib/supabase.ts` to initialize the client using environment variables:
   ```ts
   // VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   ```
3. Implement Authentication context / Zustand store to manage active session and user role (`student` vs `librarian`).
4. Replace local `useState` in `StudentPortal.tsx` and `LibrarianPortal.tsx` with hooks connecting to Supabase tables.
5. Create Supabase Storage buckets for:
   - `repository-files` (PDF thesis/journals)
   - `qris-receipts` (Payment slips uploaded by students)

---

## 6. Quick Commands

```bash
# Check TypeScript types
npx tsc --noEmit

# Run Vite dev server
npm run dev

# Create production build
npm run build
```
