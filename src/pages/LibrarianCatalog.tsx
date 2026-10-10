import { useState, useEffect, ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission, CircTab, CatalogTab, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";
import { BooksView } from "./CatalogPage";
import { RepositoryView } from "./RepositoryPage";
import { BookForm } from "./LibrarianBookForm";

export function Catalog({ items, setItems, toast }: { items: Book[]; setItems: (fn: (b: Book[]) => Book[]) => void; toast: (m: string) => void }) {
  const [tab, setTab] = useState<CatalogTab>("books");
  const [editing, setEditing] = useState<Book | null>(null);
  const [adding, setAdding] = useState(false);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onChange={setTab} items={[["books", "Buku Fisik"], ["erepo", "E-Repository"]]} />
        {tab === "books" && <Btn kind="lime" onClick={() => setAdding(true)}><Icon d="plus" className="size-4" />Tambah Buku Baru</Btn>}
      </div>
      {tab === "books" ? <BooksView items={items} onReserve={() => {}} onManage={setEditing} /> : <RepositoryView onDownload={() => toast("Salinan arsip PDF diunduh untuk pemeriksaan.")} />}
      {editing && <BookForm initial={editing} onClose={() => setEditing(null)} onSave={(b) => { setItems((xs) => xs.map((x) => (x.code === b.code ? b : x))); setEditing(null); toast(`Stok "${b.title}" diperbarui: ${b.stock} eksemplar · ${b.shelf}`); }} />}
      {adding && <BookForm onClose={() => setAdding(false)} onSave={(b) => { setItems((xs) => [b, ...xs]); setAdding(false); toast(`"${b.title}" ditambahkan ke katalog.`); }} />}
    </>
  );
}
