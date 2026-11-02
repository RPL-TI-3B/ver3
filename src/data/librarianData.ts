export type View = "dashboard" | "sirkulasi" | "fines" | "erepo_curation" | "catalog";
export type CircTab = "hold" | "loans" | "history";
export type CatalogTab = "books" | "erepo";

export type Hold = {
  id: string;
  pin: string;
  title: string;
  code: string;
  shelf: string;
  expires: string;
  expires_at: string;
};

export type Loan = {
  id: string;
  title: string;
  code: string;
  start: string;
  due: string;
  daysLeft: number;
  returned_at?: string | null;
};

export type Txn = { date: string; action: string; title: string };
export type Student = {
  id: string;
  nim: string;
  name: string;
  major: string;
  holds: Hold[];
  loans: Loan[];
  history: Txn[];
  fine: number;
  clear: boolean;
};

export type FineReq = {
  id: string;
  nim: string;
  name: string;
  major: string;
  reason: string;
  amount: number;
  uploaded: string;
  ref: string;
  receiptUrl: string | null;
  rejectionNote: string | null;
};

export type Submission = {
  id: string;
  title: string;
  author: string;
  major: string;
  size: string;
  category: "Non-Fiksi" | "Fiksi";
  type: string;
  flag?: string;
  pdfUrl: string | null;
};

export const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");
