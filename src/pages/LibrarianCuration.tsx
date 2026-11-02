import { useState } from "react";
import { Submission } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, card, input } from "./LibrarianShared";

export function Curation({ subs, loading, error, onPublish, onRevise }: { subs: Submission[]; loading: boolean; error: string | null; onPublish: (submission: Submission) => void; onRevise: (submission: Submission, note: string) => void }) {
  const [filter, setFilter] = useState<"all" | "Non-Fiksi" | "Fiksi">("all");
  const [revise, setRevise] = useState<Submission | null>(null);
  const [note, setNote] = useState("");
  const list = subs.filter((item) => filter === "all" || item.category === filter);
  return <>
    <PageHead eyebrow="Quality Control" title="Kurasi E-Repository" sub="Saring karya sebelum dipublikasikan." right={<Tabs value={filter} onChange={setFilter} items={[["all", `Semua · ${subs.length}`], ["Non-Fiksi", "Non-Fiksi"], ["Fiksi", "Fiksi"]]} />} />
    {error && <p role="alert" className="mb-4 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</p>}
    {loading && <p className={`${card} p-10 text-center text-sm text-muted`}>Memuat antrean kurasi...</p>}
    {!loading && list.length === 0 && <p className={`${card} p-10 text-center text-sm text-muted`}>Antrean kurasi kosong.</p>}
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{!loading && list.map((item) => <article key={item.id} className={`${card} flex flex-col p-5`}><div className="flex flex-wrap items-center gap-2"><Badge tone={item.category === "Fiksi" ? "lime" : "slate"}>{item.category}</Badge><span className="text-xs text-muted">{item.type} · {item.size}</span></div><h3 className="mt-3 font-bold leading-snug">{item.title}</h3><p className="mt-1 text-sm text-muted">{item.author} · {item.major}</p>{item.pdfUrl && <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"><Icon d="eye" className="size-4" />Pratinjau PDF</a>}<div className="mt-auto flex gap-2 pt-5"><Btn kind="outline" className="flex-1" onClick={() => setRevise(item)}><Icon d="pen" className="size-4" />Minta Revisi</Btn><Btn className="flex-1" onClick={() => onPublish(item)}><Icon d="check" className="size-4" />Publish</Btn></div></article>)}</div>
    {revise && <Modal title="Minta Revisi" onClose={() => setRevise(null)}><p className="text-sm text-muted">Umpan balik untuk <span className="font-semibold text-ink">{revise.title}</span></p><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="Tulis catatan revisi..." className={`${input} mt-3 resize-none`} /><div className="mt-5 flex justify-end gap-3"><Btn kind="outline" onClick={() => setRevise(null)}>Batal</Btn><Btn disabled={!note.trim()} onClick={() => { onRevise(revise, note); setRevise(null); setNote(""); }}>Kirim Umpan Balik</Btn></div></Modal>}
  </>;
}
