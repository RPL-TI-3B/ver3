import { useState, ReactNode } from "react";
import { fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";
import { useBooks } from "../lib/useSupabaseData";


export function BookForm({ initial, onSave, onClose }: { initial?: Book; onSave: (b: Book) => void; onClose: () => void }) {
  const { topics, departments } = useBooks();
  const [f, setF] = useState<Book>(initial ?? { id: "", title: "", author: "", shelf: "", stock: 1, department: "Teknologi Informasi dan Komputer", theme: "Rekayasa Perangkat Lunak", mainTheme: "Ilmu-ilmu Terapan", cover: "", code: `BARU / ${Date.now().toString().slice(-4)}`, year: new Date().getFullYear() });
  const set = <K extends keyof Book>(k: K, v: Book[K]) => setF((p) => ({ ...p, [k]: v }));
  const field = (label: string, el: ReactNode) => <label className="block"><span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>{el}</label>;
  return (
    <Modal title={initial ? "Kelola Buku" : "Tambah Buku Baru"} onClose={onClose}>
      <div className="space-y-4">
        {initial ? <div className="rounded-xl bg-canvas p-3"><p className="font-semibold">{f.title}</p><p className="text-xs text-muted">{f.author} · {f.code}</p></div> : (
          <>
            {field("Judul Buku", <input className={input} value={f.title} onChange={(e) => set("title", e.target.value)} />)}
            {field("Penulis", <input className={input} value={f.author} onChange={(e) => set("author", e.target.value)} />)}
          </>
        )}
        {field("Jumlah Stok", (
          <div className="flex items-center gap-2">
            <button onClick={() => set("stock", Math.max(0, f.stock - 1))} className="size-10 rounded-xl border border-emerald-950/10 text-lg hover:bg-canvas">−</button>
            <input type="number" min={0} className={`${input} text-center tabular-nums`} value={f.stock} onChange={(e) => set("stock", Math.max(0, Number(e.target.value)))} />
            <button onClick={() => set("stock", f.stock + 1)} className="size-10 rounded-xl border border-emerald-950/10 text-lg hover:bg-canvas">+</button>
          </div>
        ))}
        {field("Lokasi Rak", <input className={`${input} font-mono`} placeholder="B-04 / TIK" value={f.shelf} onChange={(e) => set("shelf", e.target.value)} />)}
        {field("Jurusan", <select className={input} value={f.department} onChange={(e) => set("department", e.target.value)}>{(departments.length ? departments : ["Teknologi Informasi dan Komputer", "Teknik Elektro", "Teknik Mesin", "Teknik Kimia", "Teknik Sipil", "Bisnis"]).map((name) => <option key={name}>{name}</option>)}</select>)}
        {field("Tema Utama", <select className={input} value={f.mainTheme ?? ""} onChange={(e) => { set("mainTheme", e.target.value); set("theme", ""); set("topicId", undefined); }}>{topics.filter((topic) => !topic.parentId).map((topic) => <option key={topic.id}>{topic.name}</option>)}</select>)}
        {field("Subtema", <select className={input} value={f.theme} onChange={(e) => { const topic = topics.find((item) => item.name === e.target.value); set("theme", e.target.value); set("topicId", topic?.id); }}>{topics.filter((topic) => topic.parentId && topic.parentName === f.mainTheme).map((topic) => <option key={topic.id}>{topic.name}</option>)}</select>)}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Btn kind="outline" onClick={onClose}>Batal</Btn>
        <Btn disabled={!f.title.trim() || !f.shelf.trim()} onClick={() => onSave(f)}>Simpan Perubahan</Btn>
      </div>
    </Modal>
  );
}
