import { useState, useEffect, ReactNode } from "react";
import { CatalogTab } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";
import { BooksView } from "./CatalogPage";
import { RepositoryView } from "./RepositoryPage";
import { BookForm } from "./LibrarianBookForm";
import { supabase } from "../lib/supabase";

export function Catalog({ items, setItems, toast, refetch }: { items: Book[]; setItems: (fn: (b: Book[]) => Book[]) => void; toast: (m: string) => void; refetch: () => Promise<void> }) {
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
      {editing && <BookForm initial={editing} onClose={() => setEditing(null)} onSave={async (b) => {
        const { error } = await supabase.from("books").update({ title: b.title, author: b.author, category: b.department, department_id: b.departmentId ?? null, topic_id: b.topicId ?? null, year: b.year, stock: b.stock, shelf: b.shelf, cover_url: b.cover || null }).eq("id", b.id);
        if (error) return toast(error.message);
        await refetch();
        setEditing(null);
        toast(`Stok "${b.title}" diperbarui: ${b.stock} eksemplar · ${b.shelf}`);
      }} />}
      {adding && <BookForm onClose={() => setAdding(false)} onSave={async (b) => {
        const { data, error } = await supabase.from("books").insert({ code: b.code, title: b.title, author: b.author, category: b.department, department_id: b.departmentId ?? null, topic_id: b.topicId ?? null, year: b.year, stock: b.stock, shelf: b.shelf, cover_url: b.cover || null }).select("*").single();
        if (error) return toast(error.message);
        await refetch();
        setAdding(false);
        toast(`"${b.title}" ditambahkan ke katalog.`);
      }} />}
    </>
  );
}
