export type StudentBook = {
  t: string;
  a: string;
  y: number;
  k: string;
  s: number;
  c: string;
};

export type Paper = {
  t: string;
  a: string;
  y: number;
  j: string;
  dl: number;
};

export const studentBooks: StudentBook[] = [
  { t: "Keamanan Jaringan Komputer", a: "Onno W. Purbo", y: 2021, k: "TIK 005.8", s: 3, c: "#0d372b" },
  { t: "Algoritma & Struktur Data", a: "Rinaldi Munir", y: 2020, k: "TIK 005.1", s: 0, c: "#155f46" },
  { t: "Basis Data Relasional", a: "Fathansyah", y: 2019, k: "TIK 005.74", s: 5, c: "#3b4a2a" },
  { t: "Mesin Konversi Energi", a: "Zuhal", y: 2018, k: "TM 621.3", s: 2, c: "#5c3d1e" },
  { t: "Akuntansi Biaya Terapan", a: "Mulyadi", y: 2022, k: "AK 657.4", s: 4, c: "#1f3b4d" },
  { t: "Teknik Kimia Dasar", a: "Himmelblau", y: 2017, k: "TK 660", s: 1, c: "#4d1f2f" },
  { t: "Pemrograman Web Modern", a: "Abdul Kadir", y: 2023, k: "TIK 006.7", s: 6, c: "#2c2c54" },
  { t: "Rekayasa Perangkat Lunak", a: "Roger Pressman", y: 2020, k: "TIK 005.12", s: 2, c: "#0d372b" },
];

export const papers: Paper[] = [
  { t: "Sistem Deteksi Intrusi Berbasis Machine Learning di Jaringan Kampus PNL", a: "Rahmat Fadhil", y: 2025, j: "Teknik Informatika", dl: 214 },
  { t: "Rancang Bangun Turbin Mikrohidro Sungai Krueng Pase", a: "Nurul Aini", y: 2024, j: "Teknik Mesin", dl: 132 },
  { t: "Analisis Kelayakan UMKM Kopi Gayo Pasca Pandemi", a: "Syahrul Ramadhan", y: 2025, j: "Tata Niaga", dl: 98 },
  { t: "Optimasi Produksi Pupuk Urea dengan Simulasi Aspen", a: "Cut Meutia", y: 2023, j: "Teknik Kimia", dl: 77 },
  { t: "Aplikasi Monitoring Banjir Lhokseumawe Berbasis IoT", a: "Fikri Haikal", y: 2025, j: "Teknik Elektro", dl: 186 },
  { t: "Perancangan Jembatan Rangka Baja Bentang 40m", a: "Dewi Safitri", y: 2024, j: "Teknik Sipil", dl: 64 },
];


export type View = "dashboard" | "catalog_books" | "catalog_erepo" | "circulation" | "erepo_student";
export type CircTab = "active" | "hold" | "history" | "fines";
export type ErepoTab = "upload" | "my_works" | "downloads";
export type Fine = { id: string; b: StudentBook; from: string; due: string; returned: string; late: number; state: "unpaid" | "pending_verification" | "rejected"; file?: string };
export { studentBooks as books };
