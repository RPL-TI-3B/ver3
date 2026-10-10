import { useState, useEffect, ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission, CircTab, CatalogTab, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";


export function Curation({ subs, onPublish, onRevise }: { subs: Submission[]; onPublish: (s: Submission) => void; onRevise: (s: Submission, note: string) => void }) {
  const [filter, setFilter] = useState<"all" | "Non-Fiksi" | "Fiksi">("all");
  const [revise, setRevise] = useState<Submission | null>(null);
  const [note, setNote] = useState("");
  const list = subs.filter((s) => filter === "all" || s.category === filter);
  return (
    <>
      <PageHead eyebrow="Quality Control" title="Kurasi E-Repository" sub="Saring file korup, spam, atau tidak layak sebelum karya ilmiah dan karya fiksi dipublikasikan ke katalog digital."
        right={<Tabs value={filter} onChange={setFilter} items={[["all", `Semua · ${subs.length}`], ["Non-Fiksi", "Non-Fiksi"], ["Fiksi", "Fiksi"]]} />} />
      {list.length === 0 && <p className={`${card} p-10 text-center text-sm text-muted`}>Antrean kurasi kosong.</p>}
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((s) => (
          <article key={s.id} className={`${card} flex flex-col p-5 ${s.flag ? "border-danger/25" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={s.category === "Fiksi" ? "lime" : "slate"}>{s.category}</Badge>
              <span className="text-xs text-muted">{s.type} · {s.size}</span>
            </div>
            <h3 className="mt-3 font-bold leading-snug">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.author} · {s.major}</p>
            {s.flag && <p className="mt-3 flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-xs font-semibold text-danger"><Icon d="shield" className="size-4" />{s.flag}</p>}
            <a href="#" onClick={(e) => e.preventDefault()} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"><Icon d="eye" className="size-4" />Pratinjau PDF</a>
            <div className="mt-auto flex gap-2 pt-5">
              <Btn kind="outline" className="flex-1" onClick={() => setRevise(s)}><Icon d="pen" className="size-4" />Minta Revisi</Btn>
              <Btn className="flex-1" onClick={() => onPublish(s)}><Icon d="check" className="size-4" />Setujui & Publish</Btn>
            </div>
          </article>
        ))}
      </div>
      {revise && (
        <Modal title="Minta Revisi" onClose={() => setRevise(null)}>
          <p className="text-sm text-muted">Umpan balik kurator untuk <span className="font-semibold text-ink">{revise.title}</span></p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["File PDF korup / tidak bisa dibuka", "Abstrak belum dilampirkan", "Metadata penulis tidak lengkap", "Konten tidak relevan / spam"].map((t) => (
              <button key={t} onClick={() => setNote(t)} className="rounded-full border border-emerald-950/10 px-3 py-1 text-xs text-muted hover:border-forest/30 hover:text-ink">{t}</button>
            ))}
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Tulis catatan revisi..." className={`${input} mt-3 resize-none`} />
          <div className="mt-5 flex justify-end gap-3">
            <Btn kind="outline" onClick={() => setRevise(null)}>Batal</Btn>
            <Btn disabled={!note.trim()} onClick={() => { onRevise(revise, note); setRevise(null); setNote(""); }}>Kirim Umpan Balik</Btn>
          </div>
        </Modal>
      )}
    </>
  );
}
