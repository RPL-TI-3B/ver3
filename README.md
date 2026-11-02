# SIPERPUS-REPO

Sistem informasi perpustakaan Politeknik Negeri Lhokseumawe dengan katalog buku fisik, reservasi, sirkulasi, denda QRIS, dan E-Repository mahasiswa.

## Fitur

- Katalog buku publik dengan pencarian, filter jurusan, tema utama, subtema, dan tampilan grid/list.
- Autentikasi Supabase menggunakan NIM/NIP dan password.
- Portal mahasiswa untuk dashboard, peminjaman, reservasi hold tiga hari, denda, dan unggah karya.
- Portal pustakawan untuk lookup mahasiswa, handover, pengembalian, verifikasi QRIS, kurasi repository, dan manajemen katalog.
- E-Repository dengan status `pending_curation`, `published`, dan `revision_needed`.
- Signed URL untuk file private dan Row Level Security pada data pengguna.
- Taxonomy katalog bertingkat dengan enam jurusan canonical dan tema lintas jurusan.

## Teknologi

| Area | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4 |
| Backend | Supabase PostgreSQL, Auth, Storage, RPC |
| Runtime | Node.js 20+ |
| Package manager | npm |

## Persiapan

```bash
npm install
cp .env.example .env
```

Isi `.env` dengan publishable key Supabase. Jangan pernah menaruh service role key pada variabel `VITE_` atau mengirimkannya ke browser.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Jalankan aplikasi:

```bash
npm run dev
```

## Setup Database

Pada project Supabase kosong, jalankan file berikut secara berurutan:

1. `supabase/schema.sql`
2. `supabase/migrations/001_fixes.sql`
3. `supabase/migrations/002_catalog_taxonomy.sql`
4. `supabase/migrations/20261101232250_student_page_fixes.sql`
5. `supabase/seed.sql`

Dengan Supabase CLI:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db query --linked --file supabase/schema.sql
supabase db query --linked --file supabase/migrations/001_fixes.sql
supabase db query --linked --file supabase/migrations/002_catalog_taxonomy.sql
supabase db query --linked --file supabase/migrations/20261101232250_student_page_fixes.sql
supabase db query --linked --file supabase/seed.sql
```

File SQL dirancang untuk dapat dijalankan ulang. `supabase db query` menjalankan SQL langsung dan tidak otomatis mencatat file sebagai migration history.

### Storage PDF demo

Tiga PDF E-Repository demo tersedia di `public/demo-pdfs/`. Upload ke bucket private `repository-files` jika belum tersedia:

```bash
supabase storage cp --experimental --linked \
  --content-type application/pdf \
  public/demo-pdfs/senja-di-pelabuhan-krueng-geukueh.pdf \
  ss:///repository-files/demo/senja-di-pelabuhan-krueng-geukueh.pdf
```

Ulangi untuk dua PDF lainnya. File tersebut adalah karya sintetis untuk development, bukan karya mahasiswa asli.

## Akun Demo Mahasiswa

Seeder akun demo hanya boleh dijalankan di lokal/development. Akun yang sudah ada tidak dibuat ulang; password demo diset sama dengan NIM masing-masing. Akun Ammar dan akun pustakawan tidak dikelola oleh script ini.

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-server-only-key"
export DEMO_SEED_ENABLED=true
npm run seed:demo-students
```

Seeder menolak `NODE_ENV=production`, memakai fixture ID deterministik, membuat akun Auth asli, mengunggah receipt QRIS demo, dan menyiapkan transaksi sesuai skenario.

| Nama | NIM | Program studi | Skenario |
|---|---:|---|---|
| Mahasiswa Demo | 2022573010041 | Teknologi Informasi dan Komputer | Denda belum dibayar |
| Siti Rahma | 2022573010042 | Bisnis | Akun bersih dan empty state |
| Rafi Akbar | 2022573010043 | Teknik Elektro | Peminjaman aktif |
| Nur Aini | 2022573010044 | Teknik Mesin | Peminjaman terlambat |
| Fajar Pratama | 2022573010045 | Teknik Kimia | Reservasi aktif |
| Nadia Putri | 2022573010046 | Teknik Sipil | Denda menunggu verifikasi |
| Dimas Saputra | 2022573010047 | Teknologi Informasi dan Komputer | Pembayaran ditolak |
| Cut Nabila | 2022573010048 | Bisnis | Riwayat dan denda lunas |
| Muhammad Fajri | 2022573010049 | Teknologi Informasi dan Komputer | E-Repository multi-status |

Login tetap menggunakan NIM pada UI. Email internal hanya digunakan oleh Supabase Auth.

## Model Akses

- Guest hanya dapat melihat katalog buku dan repository dengan status `published`.
- Mahasiswa hanya dapat melihat transaksi, denda, dan karya miliknya.
- Pustakawan dapat menjalankan operasi sirkulasi dan kurasi melalui role `librarian`.
- Role otorisasi berasal dari `app_metadata`/profile, bukan metadata user yang dapat diedit mahasiswa.
- File QRIS dan PDF disimpan pada bucket private dan diakses menggunakan signed URL.

## Validasi

```bash
npx tsc --noEmit
npm run build
git diff --check
```

## Struktur Utama

```text
src/
├── components/ui/       Komponen UI reusable
├── pages/               Halaman katalog dan portal
├── lib/                 Auth, Supabase client, dan data hooks
├── types/               TypeScript types
├── App.tsx              Guest routing dan session routing
├── StudentPortal.tsx    Portal mahasiswa
└── LibrarianPortal.tsx  Portal pustakawan

supabase/
├── schema.sql
├── migrations/
└── seed.sql

scripts/
└── seed-demo-students.mjs
```

## Presentasi

Deck presentasi tersedia di `docs/SIPERPUS-REPO-Demo.pptx`.
