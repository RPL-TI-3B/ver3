import { useState } from "react";
import { CircTab, Student, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, card, input } from "./LibrarianShared";

export function Sirkulasi({
  student,
  query,
  setQuery,
  loading,
  error,
  onSearch,
  onHandover,
  onReturn,
}: {
  student: Student | null;
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  error: string | null;
  onSearch: (q: string) => void;
  onHandover: (holdId: string) => void;
  onReturn: (loanId: string) => void;
}) {
  const [draft, setDraft] = useState(query);
  const [tab, setTab] = useState<CircTab>("hold");
  return (
    <>
      <PageHead eyebrow="Loket Sirkulasi" title="Loket & Lookup NIM" sub="Masukkan NIM mahasiswa atau PIN Hold untuk melihat pinjaman aktif, tiket hold, dan status denda." />
      <form onSubmit={(event) => { event.preventDefault(); setQuery(draft); onSearch(draft); }} className={`${card} flex flex-col gap-3 p-4 sm:flex-row`}>
        <div className="relative flex-1">
          <Icon d="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="NIM atau PNL-HOLD-xxxx" className={`${input} pl-10 font-mono`} />
        </div>
        <Btn type="submit" disabled={loading}>{loading ? "Mencari..." : "Cari Mahasiswa"}</Btn>
      </form>
      {error && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</p>}
      {!loading && query && !student && !error && <div className={`${card} mt-6 p-8 text-center text-sm text-muted`}>Tidak ditemukan data untuk <span className="font-mono font-semibold text-ink">{query}</span>.</div>}
      {student && (
        <>
          <section className={`${card} mt-6 grid gap-5 p-5 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:items-center`}>
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-forest text-sm font-bold text-accent">{student.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div>
              <div><p className="font-bold">{student.name}</p><p className="font-mono text-xs text-muted">{student.nim}</p><p className="text-xs text-muted">{student.major}</p></div>
            </div>
            {[["Pinjaman Aktif", `${student.loans.filter((loan) => !loan.returned_at).length} buku`], ["Tiket Hold", `${student.holds.length} aktif`]].map(([label, value]) => <div key={label} className="border-emerald-950/10 lg:border-l lg:pl-5"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p></div>)}
            <div className="border-emerald-950/10 lg:border-l lg:pl-5"><p className="text-xs text-muted">Denda & Bebas Pustaka</p><div className="mt-1.5">{student.clear ? <Badge tone="green"><Icon d="check" className="size-3.5" />Bebas Pustaka</Badge> : <Badge tone="red"><Icon d="alert" className="size-3.5" />{rupiah(student.fine)} tertunggak</Badge>}</div></div>
          </section>
          <div className="mt-6"><Tabs value={tab} onChange={setTab} items={[["hold", `Antrean Hold · ${student.holds.length}`], ["loans", `Buku Dipinjam · ${student.loans.filter((loan) => !loan.returned_at).length}`], ["history", "Riwayat Transaksi"]]} /></div>
          <div className="mt-4 space-y-3">
            {tab === "hold" && (student.holds.length ? student.holds.map((hold) => <div key={hold.id} className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}><span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-forest"><Icon d="ticket" /></span><div className="min-w-0 flex-1"><p className="font-semibold">{hold.title}</p><p className="mt-0.5 text-xs text-muted"><span className="font-mono">{hold.pin}</span> · {hold.shelf} · {hold.code}</p></div><Badge tone="amber"><Icon d="clock" className="size-3.5" />s.d. {hold.expires}</Badge><Btn kind="lime" onClick={() => onHandover(hold.id)}><Icon d="check" className="size-4" />Serahkan Buku</Btn></div>) : <p className={`${card} p-6 text-center text-sm text-muted`}>Tidak ada tiket hold aktif.</p>)}
            {tab === "loans" && (student.loans.filter((loan) => !loan.returned_at).length ? student.loans.filter((loan) => !loan.returned_at).map((loan) => <div key={loan.id} className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-center`}><div className="min-w-0 flex-1"><p className="font-semibold">{loan.title}</p><p className="mt-0.5 text-xs text-muted">Dipinjam {loan.start} · jatuh tempo {loan.due}</p></div><Badge tone={loan.daysLeft <= 3 ? "amber" : "green"}>{loan.daysLeft} hari lagi</Badge><Btn kind="outline" onClick={() => onReturn(loan.id)}>Terima Pengembalian</Btn></div>) : <p className={`${card} p-6 text-center text-sm text-muted`}>Tidak ada pinjaman aktif.</p>)}
            {tab === "history" && <div className={card}>{student.history.length ? student.history.map((transaction, index) => <div key={`${transaction.date}-${index}`} className="flex items-center gap-4 border-b border-emerald-950/10 px-5 py-3 text-sm last:border-0"><span className="w-24 shrink-0 text-xs text-muted">{transaction.date}</span><span className="flex-1 font-semibold">{transaction.title}</span><span className="text-xs text-muted">{transaction.action}</span></div>) : <p className="p-6 text-center text-sm text-muted">Belum ada riwayat transaksi.</p>}</div>}
          </div>
        </>
      )}
    </>
  );
}
