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

export const initialStudents: Student[] = [];
export const initialFines: FineReq[] = [];
export const initialSubs: Submission[] = [];
