% SIPERPUS-REPO
% Sistem Informasi Perpustakaan Politeknik Negeri Lhokseumawe
% Demo Proyek • November 2026

# Latar Belakang

- Proses katalog, peminjaman, reservasi, denda, dan repository perlu terintegrasi.
- Data mock menyulitkan pengujian alur nyata mahasiswa dan pustakawan.
- Sistem membutuhkan autentikasi, otorisasi, dan transaksi database yang aman.
- Target: satu aplikasi perpustakaan dengan sumber data Supabase.

# Tujuan Sistem

- Memudahkan mahasiswa menemukan dan meminjam buku fisik.
- Menyediakan reservasi buku dengan tiket hold selama 3 hari.
- Mengelola denda dan verifikasi pembayaran QRIS.
- Menyediakan E-Repository untuk karya ilmiah dan kreatif mahasiswa.
- Membantu pustakawan mengelola sirkulasi, katalog, dan kurasi.

# Teknologi

- **Frontend:** React 19, TypeScript, Vite 8
- **UI:** Tailwind CSS v4, komponen UI reusable
- **Backend:** Supabase PostgreSQL, Auth, Storage, RPC
- **Keamanan:** Row Level Security, role student/librarian, signed URL
- **Validasi:** TypeScript check dan production build

# Arsitektur Aplikasi

```text
Pengunjung / Mahasiswa / Pustakawan
                    │
             React + Vite UI
                    │
        Supabase Client + Auth Session
                    │
  PostgreSQL + RLS + RPC + Storage Buckets
                    │
      books • loans • holds • fines
      repository_items • downloads
```

- Guest dapat menjelajah katalog dan E-Repository published.
- Mahasiswa hanya mengakses transaksi dan karya miliknya.
- Pustakawan mendapat fungsi operasional melalui role dan RPC.

# Katalog Buku

- Katalog buku fisik dapat dibrowse tanpa login.
- Pencarian berdasarkan judul dan penulis.
- Filter jurusan dan tema dapat digunakan bersamaan.
- Taxonomy bertingkat: tema utama → subtema.
- 6 jurusan canonical:
  - Teknologi Informasi dan Komputer
  - Teknik Elektro, Teknik Mesin, Teknik Kimia
  - Teknik Sipil, Bisnis

# Sirkulasi Buku

- **Reservasi:** cek stok, lock row, kurangi stok, buat PIN unik.
- Hold aktif berlaku 3 hari dan memiliki countdown.
- **Handover:** pustakawan mengubah hold menjadi collected dan membuat loan 14 hari.
- **Pengembalian:** stok dikembalikan dan denda dihitung Rp1.000/hari.
- Hold kedaluwarsa diproses otomatis setiap 15 menit.

# Denda dan QRIS

- Status denda:
  - `unpaid`
  - `pending_verification`
  - `paid`
- Mahasiswa mengunggah bukti pembayaran ke bucket private.
- Pustakawan melihat signed URL bukti dan melakukan approve/reject.
- Status Bebas Pustaka dihitung ulang dari kewajiban denda yang tersisa.
- Relasi foreign key denda memakai relasi eksplisit untuk menghindari query ambigu.

# E-Repository

- Mahasiswa mengunggah PDF melalui dropzone drag-and-drop.
- Validasi format PDF dan batas ukuran 10 MB.
- Karya baru berstatus `pending_curation`.
- Pustakawan dapat publish atau meminta revisi.
- Browse publik hanya menampilkan karya `published`.
- File diakses melalui signed URL dan download dicatat.

# Autentikasi dan Keamanan

- Login memakai NIM/NIP yang dipetakan ke email internal Supabase.
- Role librarian berasal dari `app_metadata`, bukan user-editable metadata.
- RLS membatasi akses profile, loan, hold, fine, dan repository.
- RPC security definer digunakan untuk operasi atomik yang diperlukan.
- Service role key hanya dipakai pada script lokal seeding, tidak di frontend.

# Student Demo Scenarios

- 9 akun mahasiswa sintetis dengan password sesuai NIM.
- Skenario meliputi:
  - denda belum dibayar
  - akun bersih / empty state
  - peminjaman aktif dan terlambat
  - reservasi aktif
  - pembayaran menunggu verifikasi
  - pembayaran ditolak
  - riwayat dan denda lunas
  - E-Repository multi-status
- Seeder idempotent memakai fixture ID deterministik.

# Librarian Workflow

1. Cari mahasiswa dengan NIM atau PIN hold.
2. Tinjau reservasi dan serahkan buku.
3. Catat pengembalian buku.
4. Verifikasi bukti QRIS.
5. Kurasi karya E-Repository.
6. Kelola katalog, stok, jurusan, dan tema.

# Hasil dan Verifikasi

- 6 jurusan dan 9 tema utama tersedia.
- 49 subtema terisi minimal 2 buku.
- 116 buku katalog telah diseed.
- 3 PDF E-Repository demo valid dan tersedia di Storage.
- 9 akun demo mahasiswa dan skenario transaksi disiapkan.
- `npx tsc --noEmit` berhasil.
- `npm run build` berhasil.

# Demo yang Disarankan

- Login sebagai Siti Rahma untuk melihat empty state.
- Login sebagai Fajar untuk melihat hold dan countdown.
- Login sebagai Nadia untuk menguji antrean QRIS pustakawan.
- Login sebagai Dimas untuk menguji upload ulang setelah penolakan.
- Login sebagai Muhammad Fajri untuk menguji status karya.
- Buka Browse E-Repository sebagai guest untuk memastikan hanya karya published tampil.

# Penutup

- SIPERPUS-REPO memindahkan aplikasi dari data simulasi ke alur Supabase nyata.
- Integritas stok, transaksi, role, dan publikasi repository dijaga di database.
- Struktur modular memudahkan pengembangan fitur dan pengujian skenario.
- Fokus lanjutan: pengujian browser end-to-end dan deployment production.
