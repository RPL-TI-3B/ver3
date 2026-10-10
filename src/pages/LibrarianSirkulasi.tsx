import { useState, useEffect, ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission, CircTab, CatalogTab, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";


export function Sirkulasi({ students, query, setQuery, onHandover }: { students: Student[]; query: string; setQuery: (q: string) => void; onHandover: (nim: string, holdId: string) => void }) {
  const [draft, setDraft] = useState(query);
  const [tab, setTab] = useState<CircTab>("hold");
  useEffect(() => setDraft(query), [query]);
  const q = query.trim().toUpperCase();
  const s = q ? students.find((x) => x.nim === q || x.holds.some((h) => h.pin === q)) : undefined;
  return (
    <>
      <PageHead eyebrow="Loket Sirkulasi" title="Loket & Lookup NIM" sub="Masukkan NIM mahasiswa atau PIN Hold untuk melihat pinjaman aktif, tiket hold, dan status denda." />
      <form onSubmit={(e) => { e.preventDefault(); setQuery(draft); }} className={`${card} flex flex-col gap-3 p-4 sm:flex-row`}>
        <div className="relative flex-1">
          <Icon d="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="2022573010041 atau PNL-HOLD-8921" className={`${input} pl-10 font-mono`} />
        </div>
        <Btn type="submit">Cari Mahasiswa</Btn>
      </form>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
        Coba:
        {["2022573010041", "PNL-HOLD-8921", "2021571020017"].map((x) => <button key={x} onClick={() => setQuery(x)} className="font-mono text-forest underline-offset-2 hover:underline">{x}</button>)}
      </div>

      {q && !s && <div className={`${card} mt-6 p-8 text-center text-sm text-muted`}>Tidak ditemukan data untuk <span className="font-mono font-semibold text-ink">{q}</span>.</div>}
      {s && (
        <>
          <section className={`${card} mt-6 grid gap-5 p-5 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:items-center`}>
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-forest text-sm font-bold text-accent">{s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div><p className="font-bold">{s.name}</p><p className="font-mono text-xs text-muted">{s.nim}</p><p className="text-xs text-muted">{s.major}</p></div>
            </div>
            {[["Pinjaman Aktif", `${s.loans.length} buku`], ["Tiket Hold", `${s.holds.length} siap ambil`]].map(([l, v]) => (
              <div key={l} className="border-emerald-950/10 lg:border-l lg:pl-5"><p className="text-xs text-muted">{l}</p><p className="mt-1 text-lg font-extrabold">{v}</p></div>
            ))}
            <div className="border-emerald-950/10 lg:border-l lg:pl-5">
              <p className="text-xs text-muted">Denda & Bebas Pustaka</p>
              <div className="mt-1.5">{s.clear ? <Badge tone="green"><Icon d="check" className="size-3.5" />Bebas Pustaka</Badge> : <Badge tone="red"><Icon d="alert" className="size-3.5" />{rupiah(s.fine)} tertunggak</Badge>}</div>
            </div>
          </section>
          <div className="mt-6"><Tabs value={tab} onChange={setTab} items={[["hold", `Antrean Hold (Siap Ambil) · ${s.holds.length}`], ["loans", `Buku Sedang Dipinjam · ${s.loans.length}`], ["history", "Riwayat Transaksi"]]} /></div>
          <div className="mt-4 space-y-3">
            {tab === "hold" && (s.holds.length === 0 ? <p className={`${card} p-6 text-center text-sm text-muted`}>Tidak ada tiket hold aktif.</p> : s.holds.map((h) => (
              <div key={h.id} className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}>
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-forest"><Icon d="ticket" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{h.title}</p>
                  <p className="mt-0.5 text-xs text-muted"><span className="font-mono">{h.pin}</span> · {h.shelf} · kode {h.code}</p>
                </div>
                <Badge tone="amber"><Icon d="clock" className="size-3.5" />Hold s.d. {h.expires}</Badge>
                <Btn kind="lime" onClick={() => onHandover(s.nim, h.id)}><Icon d="check" className="size-4" />Serahkan Buku</Btn>
              </div>
            )))}
            {tab === "loans" && (s.loans.length === 0 ? <p className={`${card} p-6 text-center text-sm text-muted`}>Tidak ada pinjaman aktif.</p> : s.loans.map((l) => (
              <div key={l.id} className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}>
                <div className="min-w-0 flex-1"><p className="font-semibold">{l.title}</p><p className="mt-0.5 text-xs text-muted">Dipinjam {l.start} · jatuh tempo {l.due}</p></div>
                <Badge tone={l.daysLeft <= 3 ? "amber" : "green"}>{l.daysLeft} hari lagi</Badge>
              </div>
            )))}
            {tab === "history" && (
              <div className={card}>
                {s.history.map((t, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-emerald-950/10 px-5 py-3 text-sm last:border-0">
                    <span className="w-24 shrink-0 text-xs text-muted">{t.date}</span><span className="flex-1 font-semibold">{t.title}</span><span className="text-xs text-muted">{t.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
