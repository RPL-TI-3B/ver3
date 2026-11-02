# SIPERPUS PNL

React 19 + Vite + Tailwind CSS v4 dengan Supabase sebagai sumber data dan autentikasi.

## Setup

1. Salin `.env.example` menjadi `.env` lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` (atau `VITE_SUPABASE_ANON_KEY`).
2. Pada project Supabase kosong, jalankan berurutan: `supabase/schema.sql`, `supabase/migrations/001_fixes.sql`, `supabase/migrations/002_catalog_taxonomy.sql`, `supabase/migrations/20261101232250_student_page_fixes.sql`, lalu `supabase/seed.sql`. Semuanya aman dijalankan ulang; seed memakai `on conflict`/lookup agar tidak menggandakan data.
3. Jika memakai Supabase CLI, jalankan `supabase db query --linked --file <file>` untuk setiap file dalam urutan di atas. Migrasi katalog menyediakan master jurusan dan tema bertingkat; migration student page memperbaiki PIN reservasi, batas file storage, dan job kedaluwarsa hold.
4. Setelah seed, upload PDF demo ke Storage dengan CLI (fitur Storage CLI masih experimental):
   `supabase storage cp --experimental --linked --content-type application/pdf public/demo-pdfs/senja-di-pelabuhan-krueng-geukueh.pdf ss:///repository-files/demo/senja-di-pelabuhan-krueng-geukueh.pdf`
   Ulangi perintah yang sama untuk dua file PDF lain di `public/demo-pdfs/`.
   File demo hanya untuk pengujian dan ditandai sebagai karya sintetis. Jangan menghapus atau menimpa file karya pengguna.
5. Jalankan `npm install` dan `npm run dev`.

## Akun demo

Di Dashboard Supabase buka **Authentication → Users → Add user**. Supabase tetap memerlukan email internal, tetapi pengguna login menggunakan NIM/NIP; email ini tidak perlu ditampilkan di UI:

- Mahasiswa: `2022573010041@siperpus.pnl.ac.id`, login dengan NIM `2022573010041`
- Pustakawan: `198503152010011001@siperpus.pnl.ac.id`, login dengan NIP `198503152010011001`
- Akun Ammar: `2024573010129@siperpus.pnl.ac.id`, login dengan NIM `2024573010129`, prodi `Teknologi Informasi dan Komputer`

Tetapkan password masing-masing. Setelah akun dibuat, buka **Edit user → Metadata** dan isi `app_metadata` pustakawan dengan `{"role":"librarian"}`. Jangan menaruh role librarian di `user_metadata`. Jalankan seed ulang untuk data demo.

### Student Demo Accounts

Seeder akun mahasiswa hanya boleh dijalankan secara lokal/development. Isi environment berikut tanpa menaruh service role key pada variabel `VITE_`:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."
export DEMO_SEED_ENABLED=true
npm run seed:demo-students
```

Password setiap akun demo mahasiswa adalah NIM masing-masing. Script tidak membuat duplikat, tidak berjalan saat `NODE_ENV=production`, dan memakai fixture ID deterministik untuk transaksi. Email internal hanya kebutuhan Supabase Auth; login tetap memakai NIM.

| Nama | NIM | Email internal | Program Studi | Skenario |
|---|---|---|---|---|
| Mahasiswa Demo | 2022573010041 | 2022573010041@siperpus.pnl.ac.id | Teknologi Informasi dan Komputer | Denda belum dibayar |
| Siti Rahma | 2022573010042 | 2022573010042@siperpus.pnl.ac.id | Bisnis | Akun bersih / empty state |
| Rafi Akbar | 2022573010043 | 2022573010043@siperpus.pnl.ac.id | Teknik Elektro | Peminjaman aktif |
| Nur Aini | 2022573010044 | 2022573010044@siperpus.pnl.ac.id | Teknik Mesin | Peminjaman terlambat |
| Fajar Pratama | 2022573010045 | 2022573010045@siperpus.pnl.ac.id | Teknik Kimia | Reservasi aktif |
| Nadia Putri | 2022573010046 | 2022573010046@siperpus.pnl.ac.id | Teknik Sipil | Denda menunggu verifikasi |
| Dimas Saputra | 2022573010047 | 2022573010047@siperpus.pnl.ac.id | Teknologi Informasi dan Komputer | Pembayaran ditolak |
| Cut Nabila | 2022573010048 | 2022573010048@siperpus.pnl.ac.id | Bisnis | Riwayat dan denda lunas |
| Muhammad Fajri | 2022573010049 | 2022573010049@siperpus.pnl.ac.id | Teknologi Informasi dan Komputer | E-Repository multi-status |

Seeder juga mengunggah bukti QRIS sintetis bertanda DEMO, membuat buku fixture, transaksi, dan tiga karya E-Repository Fajri. Jalankan ulang command yang sama untuk mengembalikan seluruh skenario ke keadaan deterministik; akun yang sudah ada tetap memakai password sebelumnya.

## Validasi

```bash
npx tsc --noEmit
npm run build
```
