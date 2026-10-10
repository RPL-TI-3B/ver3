export type Hold = { id: string; pin: string; title: string; code: string; shelf: string; expires: string };
export type Loan = { id: string; title: string; code: string; start: string; due: string; daysLeft: number };
export type Txn = { date: string; action: string; title: string };
export type Student = { nim: string; name: string; major: string; holds: Hold[]; loans: Loan[]; history: Txn[]; fine: number; clear: boolean };
export type FineReq = { id: string; nim: string; name: string; major: string; reason: string; amount: number; uploaded: string; ref: string };
export type Submission = { id: string; title: string; author: string; major: string; size: string; category: "Non-Fiksi" | "Fiksi"; type: string; flag?: string };

export type View = "dashboard" | "sirkulasi" | "fines" | "erepo_curation" | "catalog";
export type CircTab = "hold" | "loans" | "history";
export type CatalogTab = "books" | "erepo";

export const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export const initialStudents: Student[] = [
  {
    nim: "2022573010041", name: "Ammar Fauzan", major: "Teknik Informatika", fine: 6000, clear: false,
    holds: [
      { id: "h1", pin: "PNL-HOLD-8921", title: "Keamanan Jaringan Komputer", code: "CYBER / 02", shelf: "Rak A3 - TIK", expires: "06 Okt 2026" },
      { id: "h2", pin: "PNL-HOLD-8934", title: "Algoritma dan Pemrograman Modern", code: "ALGO / 01", shelf: "Rak A1 - TIK", expires: "07 Okt 2026" },
    ],
    loans: [{ id: "l1", title: "Basis Data Relasional", code: "TIK 005.74", start: "24 Sep 2026", due: "08 Okt 2026", daysLeft: 4 }],
    history: [
      { date: "24 Sep 2026", action: "Peminjaman", title: "Basis Data Relasional" },
      { date: "18 Sep 2026", action: "Pengembalian (terlambat 3 hari)", title: "Rekayasa Perangkat Lunak" },
      { date: "02 Sep 2026", action: "Peminjaman", title: "Rekayasa Perangkat Lunak" },
    ],
  },
  {
    nim: "2021571020017", name: "Cut Nadia Rahmi", major: "Teknik Sipil", fine: 0, clear: true,
    holds: [{ id: "h3", pin: "PNL-HOLD-8950", title: "Struktur Beton Bertulang", code: "SIPIL / 03", shelf: "Rak B2 - SIPIL", expires: "05 Okt 2026" }],
    loans: [],
    history: [{ date: "11 Sep 2026", action: "Pengembalian", title: "Mekanika Tanah Jilid 1" }],
  },
];

export const initialFines: FineReq[] = [
  { id: "f1", nim: "2022573010041", name: "Ammar Fauzan", major: "Teknik Informatika", reason: "Terlambat 3 hari · Rekayasa Perangkat Lunak", amount: 6000, uploaded: "04 Okt, 09.12", ref: "QRIS-PNL-77120" },
  { id: "f2", nim: "2020574030102", name: "Teuku Rizki Maulana", major: "Teknik Mesin", reason: "Terlambat 7 hari · Mesin Konversi Energi", amount: 14000, uploaded: "04 Okt, 08.40", ref: "QRIS-PNL-77098" },
  { id: "f3", nim: "2023575010066", name: "Siti Humaira", major: "Akuntansi", reason: "Terlambat 2 hari · Akuntansi Biaya Terapan", amount: 4000, uploaded: "03 Okt, 15.27", ref: "QRIS-PNL-77011" },
];

export const initialSubs: Submission[] = [
  { id: "s1", title: "Sistem Deteksi Intrusi Berbasis Machine Learning di Jaringan Kampus PNL", author: "Rahmat Fadhil", major: "Teknik Informatika", size: "4,2 MB", category: "Non-Fiksi", type: "Skripsi" },
  { id: "s2", title: "Senja di Ujung Krueng Pase", author: "Nurul Aini", major: "Tata Niaga", size: "1,1 MB", category: "Fiksi", type: "Novelet" },
  { id: "s3", title: "tugas akhir final revisi FIX (2)", author: "Anonim_88", major: "Tidak diisi", size: "0,02 MB", category: "Non-Fiksi", type: "Laporan", flag: "Ukuran file janggal · kemungkinan korup" },
  { id: "s4", title: "Aplikasi Monitoring Banjir Lhokseumawe Berbasis IoT", author: "Fikri Haikal", major: "Teknik Elektro", size: "6,8 MB", category: "Non-Fiksi", type: "Tugas Akhir" },
  { id: "s5", title: "Antologi Puisi: Laut, Garam, dan Pulang", author: "Dewi Safitri", major: "Teknik Sipil", size: "0,9 MB", category: "Fiksi", type: "Antologi" },
  { id: "s6", title: "Analisis Kelayakan UMKM Kopi Gayo Pasca Pandemi", author: "Syahrul Ramadhan", major: "Tata Niaga", size: "3,3 MB", category: "Non-Fiksi", type: "Jurnal" },
  { id: "s7", title: "DOWNLOAD GRATIS FILM TERBARU klik link", author: "promo2026", major: "—", size: "12,4 MB", category: "Fiksi", type: "—", flag: "Terindikasi spam · tautan eksternal" },
];

