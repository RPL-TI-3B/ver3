import { BookTopic } from "../types";

const mainTopics = [
  ["Filsafat", "filsafat"],
  ["Agama", "agama"],
  ["Ilmu-ilmu Sosial", "ilmu-ilmu-sosial"],
  ["Ilmu-ilmu Murni", "ilmu-ilmu-murni"],
  ["Ilmu-ilmu Terapan", "ilmu-ilmu-terapan"],
  ["Kesenian, Hiburan, dan Olahraga", "kesenian-hiburan-olahraga"],
  ["Kesusastraan", "kesusastraan"],
  ["Geografi dan Sejarah", "geografi-sejarah"],
  ["Bahasa", "bahasa"],
] as const;

const subTopics: Array<[string, string, string]> = [
  ["Ilmu-ilmu Terapan", "Teknologi Informasi dan Komputer", "tik"],
  ["Ilmu-ilmu Terapan", "Teknik Elektro", "teknik-elektro"],
  ["Ilmu-ilmu Terapan", "Teknik Mesin", "teknik-mesin"],
  ["Ilmu-ilmu Terapan", "Teknik Kimia", "teknik-kimia"],
  ["Ilmu-ilmu Terapan", "Teknik Sipil", "teknik-sipil"],
  ["Ilmu-ilmu Sosial", "Akuntansi", "akuntansi"],
  ["Ilmu-ilmu Sosial", "Kewirausahaan", "kewirausahaan"],
  ["Ilmu-ilmu Sosial", "Bisnis Digital", "bisnis-digital"],
  ["Filsafat", "Filsafat Ilmu", "filsafat-ilmu"],
  ["Agama", "Studi Islam", "studi-islam"],
  ["Bahasa", "Linguistik", "linguistik"],
  ["Kesusastraan", "Sastra Indonesia", "sastra-indonesia"],
  ["Geografi dan Sejarah", "Sejarah Indonesia", "sejarah-indonesia"],
  ["Teknologi Informasi dan Komputer", "Pemrograman", "pemrograman"],
  ["Teknologi Informasi dan Komputer", "Basis Data", "basis-data"],
  ["Teknologi Informasi dan Komputer", "Rekayasa Perangkat Lunak", "rekayasa-perangkat-lunak"],
  ["Teknik Elektro", "Elektronika", "elektronika"],
  ["Teknik Elektro", "Sistem Tenaga Listrik", "sistem-tenaga-listrik"],
  ["Teknik Mesin", "Termodinamika", "termodinamika"],
  ["Teknik Mesin", "Teknologi Manufaktur", "teknologi-manufaktur"],
  ["Teknik Kimia", "Proses Industri Kimia", "proses-industri-kimia"],
  ["Teknik Kimia", "Pengolahan Limbah Industri", "pengolahan-limbah-industri"],
  ["Teknik Sipil", "Teknologi Beton", "teknologi-beton"],
  ["Teknik Sipil", "Manajemen Konstruksi", "manajemen-konstruksi"],
];

export const fallbackDepartments = [
  "Teknologi Informasi dan Komputer",
  "Teknik Elektro",
  "Teknik Mesin",
  "Teknik Kimia",
  "Teknik Sipil",
  "Bisnis",
];

export const fallbackTopics: BookTopic[] = [
  ...mainTopics.map(([name, slug], index) => ({
    id: `fallback-${slug}`,
    name,
    slug,
    parentId: null,
    parentName: null,
    sortOrder: index + 1,
  })),
  ...subTopics.map(([parentName, name, slug], index) => ({
    id: `fallback-${slug}`,
    name,
    slug,
    parentId: `fallback-${parentName}`,
    parentName,
    sortOrder: index + 1,
  })),
];
