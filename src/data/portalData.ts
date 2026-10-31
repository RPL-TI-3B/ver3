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

export const studentBooks: StudentBook[] = [];
export const papers: Paper[] = [];

export type View = "dashboard" | "catalog_books" | "catalog_erepo" | "circulation" | "erepo_student";
export type CircTab = "active" | "hold" | "history" | "fines";
export type ErepoTab = "upload" | "my_works" | "downloads";
export type Fine = { id: string; b: StudentBook; from: string; due: string; returned: string; late: number; state: "unpaid" | "pending_verification" | "rejected"; file?: string };
export { studentBooks as books };
