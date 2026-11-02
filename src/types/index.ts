export type Tab = "books" | "erepo" | "about";
export type Layout = "list" | "grid4" | "grid5" | "grid6";
export type LoginRole = "student" | "staff";
export type ModalSource = "navbar" | "reservation" | "download";

export type IconName =
  | "arrowDown"
  | "book"
  | "books"
  | "building"
  | "calendar"
  | "check"
  | "clock"
  | "close"
  | "download"
  | "file"
  | "grid4"
  | "grid5"
  | "grid6"
  | "info"
  | "layers"
  | "list"
  | "location"
  | "lock"
  | "mail"
  | "map"
  | "phone"
  | "search"
  | "shield"
  | "user";

export type Book = {
  id: string;
  title: string;
  author: string;
  shelf: string;
  stock: number;
  department: string;
  theme: string;
  mainTheme?: string;
  departmentId?: string;
  topicId?: string;
  cover: string;
  code: string;
  year: number;
};

export type BookTopic = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  parentName: string | null;
  sortOrder: number;
};

export type RepoItem = {
  id: string;
  title: string;
  author: string;
  department: string;
  size: string;
  category: "nonfiction" | "fiction";
  type: string;
  accent: string;
  year: string;
  pdfUrl: string | null;
  downloadsCount: number;
  badge?: string;
};
