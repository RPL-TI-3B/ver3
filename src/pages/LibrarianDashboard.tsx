import { useState, useEffect, ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission, CircTab, CatalogTab, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";


export function Dashboard({ go, txCount, holdCount, fines, subs }: { go: (v: View) => void; txCount: number; holdCount: number; fines: FineReq[]; subs: Submission[] }) {
  const queue = [
    ...fines.map((f) => ({ k: f.id, icon: "receipt" as const, title: `Struk QRIS ${rupiah(f.amount)} — ${f.name}`, meta: `${f.nim} · diunggah ${f.uploaded}`, badge: <Badge tone="amber">Menunggu Verifikasi</Badge>, view: "fines" as View })),
    ...subs.slice(0, 3).map((s) => ({ k: s.id, icon: "fileCheck" as const, title: s.title, meta: `${s.author} · ${s.category} · ${s.size}`, badge: s.flag ? <Badge tone="red">Perlu dicek</Badge> : <Badge tone="blue">Kurasi</Badge>, view: "erepo_curation" as View })),
  ];
  return (
    <>
      <PageHead eyebrow="Sabtu, 04 Oktober 2026" title="Dashboard Operasional" sub="Ringkasan meja layanan sirkulasi hari ini. Klik kartu untuk langsung menuju antrean terkait." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Transaksi Hari Ini" value={txCount} icon="repeat" note="Pinjam + kembali sejak 08.00" onClick={() => go("sirkulasi")} />
        <Metric label="Antrean Hold Active" value={holdCount} icon="ticket" note="Siap diambil di loket" onClick={() => go("sirkulasi")} />
        <Metric label="Verifikasi QRIS Pending" value={fines.length} icon="receipt" note="Struk pembayaran denda" onClick={() => go("fines")} />
        <Metric label="Antrean Kurasi E-Repo" value={subs.length} icon="fileCheck" note="Karya menunggu publikasi" onClick={() => go("erepo_curation")} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className={card}>
          <div className="flex items-center justify-between border-b border-emerald-950/10 px-5 py-4">
            <h2 className="font-bold">Antrean Tindakan Cepat</h2>
            <Badge tone="lime">{queue.length} item</Badge>
          </div>
          {queue.length === 0 ? <p className="p-8 text-center text-sm text-muted">Semua antrean bersih. Kerja bagus.</p> : (
            <ul className="divide-y divide-emerald-950/10">
              {queue.map((q) => (
                <li key={q.k} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-emerald-950/10 text-forest"><Icon d={q.icon} className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{q.title}</p><p className="text-xs text-muted">{q.meta}</p></div>
                  <span className="hidden sm:block">{q.badge}</span>
                  <button onClick={() => go(q.view)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest hover:bg-canvas">Proses</button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={`${card} p-5`}>
          <h2 className="font-bold">Jadwal Loket</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {[["08.00", "Buka loket sirkulasi Lantai 1"], ["10.30", "Pengecekan rak TIK & Elektro"], ["13.00", "Batch verifikasi QRIS siang"], ["16.00", "Tutup antrean hold kedaluwarsa"]].map(([t, l]) => (
              <li key={t} className="flex gap-4"><span className="w-12 font-mono text-xs font-semibold text-forest-light">{t}</span><span className="flex-1 border-l border-emerald-950/10 pl-4 text-muted">{l}</span></li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
