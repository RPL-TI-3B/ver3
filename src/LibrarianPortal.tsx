import { useEffect, useState, type ReactNode } from "react";
import { BooksView } from "./pages/CatalogPage";
import { RepositoryView } from "./pages/RepositoryPage";
import { books as seedBooks } from "./data/mockData";
import { type Book } from "./types";

type View = "dashboard" | "sirkulasi" | "fines" | "erepo_curation" | "catalog";
type CircTab = "hold" | "loans" | "history";
type CatalogTab = "books" | "erepo";

/* ---------- Icons (fine-line) ---------- */
const P = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  userCheck: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 4 1.5M16 18l2 2 4-4",
  receipt: "M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21zM9 8h6M9 12h6M9 16h3",
  fileCheck: "M14 3H6v18h12V7zM14 3v4h4M9 14l2 2 4-4",
  books: "M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.8 1-3.9 15-3.8-1z",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 9-10",
  chevL: "M15 6l-6 6 6 6",
  chevR: "M9 6l6 6-6 6",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  ticket: "M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3zM14 6v12",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  plus: "M12 5v14M5 12h14",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  pen: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
};
function Icon({ d, className = "size-5" }: { d: keyof typeof P; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={P[d]} />
    </svg>
  );
}

/* ---------- Atoms (mirrors StudentPortal) ---------- */
const card = "rounded-2xl border border-emerald-950/10 bg-white";
const input = "w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-accent/30";
function Badge({ tone, children }: { tone: "green" | "amber" | "red" | "slate" | "lime" | "blue"; children: ReactNode }) {
  const m = {
    green: "bg-success-soft text-success",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-danger-soft text-danger",
    slate: "bg-slate-100 text-muted",
    lime: "bg-accent-soft text-forest",
    blue: "bg-sky-50 text-sky-800",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${m}`}>{children}</span>;
}
function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-emerald-950/10 bg-white p-1">
      {items.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${value === k ? "bg-forest text-white" : "text-muted hover:bg-canvas hover:text-ink"}`}>{l}</button>
      ))}
    </div>
  );
}
function Btn({ kind = "primary", className = "", children, ...rest }: { kind?: "primary" | "outline" | "lime" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const k = {
    primary: "bg-forest text-white hover:bg-forest-light",
    lime: "bg-accent text-forest hover:bg-accent-hover",
    outline: "border border-emerald-950/15 bg-white text-ink hover:border-forest/30 hover:bg-canvas",
    danger: "border border-danger/25 bg-white text-danger hover:bg-danger-soft",
  }[kind];
  return <button {...rest} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-45 ${k} ${className}`}>{children}</button>;
}
function PageHead({ eyebrow, title, sub, right }: { eyebrow: string; title: string; sub: string; right?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-forest-light">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>
      </div>
      {right}
    </header>
  );
}
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal className={`${card} max-h-[92vh] w-full overflow-y-auto p-6 shadow-2xl ${wide ? "max-w-3xl" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-canvas" aria-label="Tutup"><Icon d="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------- Data ---------- */
type Hold = { id: string; pin: string; title: string; code: string; shelf: string; expires: string };
type Loan = { id: string; title: string; code: string; start: string; due: string; daysLeft: number };
type Txn = { date: string; action: string; title: string };
type Student = { nim: string; name: string; major: string; holds: Hold[]; loans: Loan[]; history: Txn[]; fine: number; clear: boolean };
type FineReq = { id: string; nim: string; name: string; major: string; reason: string; amount: number; uploaded: string; ref: string };
type Submission = { id: string; title: string; author: string; major: string; size: string; category: "Non-Fiksi" | "Fiksi"; type: string; flag?: string };

const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

const initialStudents: Student[] = [
  {
    nim: "2022573010041", name: "Ammar Fauzan", major: "Teknik Informatika", fine: 6000, clear: false,
    holds: [
      { id: "h1", pin: "PNL-HOLD-8921", title: "Keamanan Jaringan Komputer", code: "CYBER / 02", shelf: "Rak A3 - TIK", expires: "06 Okt 2026" },
      { id: "h2", pin: "PNL-HOLD-8934", title: "Algoritma dan Pemrograman Modern", code: "ALGO / 01", shelf: "Rak A1 - TIK", expires: "07 Okt 2026" },
    ],
    loans: [{ id: "l1", title: "Basis Data Relasional", code: "TIK 005.74", start: "24 Sep 2026", due: "08 Okt 2026", daysLeft: 4 }],
    history: [
      { date: "24 Sep 2026", action: "Peminjaman", title: "Basis Data Relasional" },
      { date: "18 Sep 2026", action: "Pengembalian (terlambat 3 hari)", title: "Rekayasa Perangkat Lunak" },
      { date: "02 Sep 2026", action: "Peminjaman", title: "Rekayasa Perangkat Lunak" },
    ],
  },
  {
    nim: "2021571020017", name: "Cut Nadia Rahmi", major: "Teknik Sipil", fine: 0, clear: true,
    holds: [{ id: "h3", pin: "PNL-HOLD-8950", title: "Struktur Beton Bertulang", code: "SIPIL / 03", shelf: "Rak B2 - SIPIL", expires: "05 Okt 2026" }],
    loans: [],
    history: [{ date: "11 Sep 2026", action: "Pengembalian", title: "Mekanika Tanah Jilid 1" }],
  },
];

const initialFines: FineReq[] = [
  { id: "f1", nim: "2022573010041", name: "Ammar Fauzan", major: "Teknik Informatika", reason: "Terlambat 3 hari · Rekayasa Perangkat Lunak", amount: 6000, uploaded: "04 Okt, 09.12", ref: "QRIS-PNL-77120" },
  { id: "f2", nim: "2020574030102", name: "Teuku Rizki Maulana", major: "Teknik Mesin", reason: "Terlambat 7 hari · Mesin Konversi Energi", amount: 14000, uploaded: "04 Okt, 08.40", ref: "QRIS-PNL-77098" },
  { id: "f3", nim: "2023575010066", name: "Siti Humaira", major: "Akuntansi", reason: "Terlambat 2 hari · Akuntansi Biaya Terapan", amount: 4000, uploaded: "03 Okt, 15.27", ref: "QRIS-PNL-77011" },
];

const initialSubs: Submission[] = [
  { id: "s1", title: "Sistem Deteksi Intrusi Berbasis Machine Learning di Jaringan Kampus PNL", author: "Rahmat Fadhil", major: "Teknik Informatika", size: "4,2 MB", category: "Non-Fiksi", type: "Skripsi" },
  { id: "s2", title: "Senja di Ujung Krueng Pase", author: "Nurul Aini", major: "Tata Niaga", size: "1,1 MB", category: "Fiksi", type: "Novelet" },
  { id: "s3", title: "tugas akhir final revisi FIX (2)", author: "Anonim_88", major: "Tidak diisi", size: "0,02 MB", category: "Non-Fiksi", type: "Laporan", flag: "Ukuran file janggal · kemungkinan korup" },
  { id: "s4", title: "Aplikasi Monitoring Banjir Lhokseumawe Berbasis IoT", author: "Fikri Haikal", major: "Teknik Elektro", size: "6,8 MB", category: "Non-Fiksi", type: "Tugas Akhir" },
  { id: "s5", title: "Antologi Puisi: Laut, Garam, dan Pulang", author: "Dewi Safitri", major: "Teknik Sipil", size: "0,9 MB", category: "Fiksi", type: "Antologi" },
  { id: "s6", title: "Analisis Kelayakan UMKM Kopi Gayo Pasca Pandemi", author: "Syahrul Ramadhan", major: "Tata Niaga", size: "3,3 MB", category: "Non-Fiksi", type: "Jurnal" },
  { id: "s7", title: "DOWNLOAD GRATIS FILM TERBARU klik link", author: "promo2026", major: "—", size: "12,4 MB", category: "Fiksi", type: "—", flag: "Terindikasi spam · tautan eksternal" },
];

/* ---------- Views ---------- */
function Metric({ label, value, icon, note, onClick }: { label: string; value: number; icon: keyof typeof P; note: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${card} group p-5 text-left transition hover:-translate-y-0.5 hover:border-forest/25`}>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-forest"><Icon d={icon} /></span>
        <Icon d="arrowR" className="size-4 text-muted opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="mt-5 text-3xl font-extrabold tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
    </button>
  );
}

function Dashboard({ go, txCount, holdCount, fines, subs }: { go: (v: View) => void; txCount: number; holdCount: number; fines: FineReq[]; subs: Submission[] }) {
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

function Sirkulasi({ students, query, setQuery, onHandover }: { students: Student[]; query: string; setQuery: (q: string) => void; onHandover: (nim: string, holdId: string) => void }) {
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

function Fines({ fines, onApprove, onReject }: { fines: FineReq[]; onApprove: (f: FineReq) => void; onReject: (f: FineReq, note: string) => void }) {
  const [open, setOpen] = useState<FineReq | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const close = () => { setOpen(null); setRejecting(false); setNote(""); };
  return (
    <>
      <PageHead eyebrow="Keuangan Perpustakaan" title="Verifikasi Denda QRIS" sub="Cocokkan nominal dan nomor referensi pada struk dengan data denda sebelum menyetel lunas." />
      <div className={`${card} overflow-hidden`}>
        <div className="hidden grid-cols-[1.4fr_1.6fr_0.8fr_1fr_auto] gap-4 border-b border-emerald-950/10 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted md:grid">
          <span>Mahasiswa</span><span>Alasan Denda</span><span>Nominal</span><span>Status</span><span className="w-28" />
        </div>
        {fines.length === 0 && <p className="p-10 text-center text-sm text-muted">Tidak ada struk yang menunggu verifikasi.</p>}
        {fines.map((f) => (
          <div key={f.id} className="grid gap-3 border-b border-emerald-950/10 px-5 py-4 last:border-0 md:grid-cols-[1.4fr_1.6fr_0.8fr_1fr_auto] md:items-center md:gap-4">
            <div><p className="font-semibold">{f.name}</p><p className="font-mono text-xs text-muted">{f.nim}</p></div>
            <p className="text-sm text-muted">{f.reason}</p>
            <p className="font-bold tabular-nums">{rupiah(f.amount)}</p>
            <div><Badge tone="amber">Menunggu Verifikasi</Badge></div>
            <Btn kind="outline" className="w-28" onClick={() => setOpen(f)}><Icon d="eye" className="size-4" />Lihat Struk</Btn>
          </div>
        ))}
      </div>
      {open && (
        <Modal title="Bukti Pembayaran QRIS" onClose={close} wide>
          <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
            <div className="rounded-xl border border-emerald-950/10 bg-canvas p-5">
              <div className="mx-auto max-w-[240px] rounded-lg border border-dashed border-emerald-950/20 bg-white p-5 font-mono text-xs leading-relaxed">
                <p className="text-center font-bold">BANK ACEH SYARIAH</p>
                <p className="text-center text-muted">Pembayaran QRIS Berhasil</p>
                <div className="my-3 border-t border-dashed border-emerald-950/20" />
                <p>Merchant: PERPUS PNL</p><p>Ref: {open.ref}</p><p>Waktu: {open.uploaded}</p><p>Pengirim: {open.name.toUpperCase()}</p>
                <div className="my-3 border-t border-dashed border-emerald-950/20" />
                <p className="flex justify-between font-bold"><span>TOTAL</span><span>{rupiah(open.amount)}</span></p>
                <p className="mt-3 text-center text-success">✓ SUKSES</p>
              </div>
            </div>
            <div className="flex flex-col">
              <dl className="space-y-3 text-sm">
                {[["Mahasiswa", `${open.name} · ${open.nim}`], ["Program Studi", open.major], ["Alasan", open.reason], ["Tagihan sistem", rupiah(open.amount)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-emerald-950/10 pb-2"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-4 flex items-center gap-2 text-xs text-success"><Icon d="check" className="size-4" />Nominal struk cocok dengan tagihan sistem.</p>
              {rejecting && <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Catatan opsional, mis. nomor referensi tidak terbaca" className={`${input} mt-4 resize-none`} />}
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {rejecting ? (
                  <>
                    <Btn kind="outline" onClick={() => setRejecting(false)}>Batal</Btn>
                    <Btn kind="danger" className="flex-1" onClick={() => { onReject(open, note); close(); }}>Kirim Penolakan</Btn>
                  </>
                ) : (
                  <>
                    <Btn kind="danger" onClick={() => setRejecting(true)}><Icon d="x" className="size-4" />Tolak Bukti</Btn>
                    <Btn className="flex-1" onClick={() => { onApprove(open); close(); }}><Icon d="check" className="size-4" />Approve (Setel Lunas)</Btn>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Curation({ subs, onPublish, onRevise }: { subs: Submission[]; onPublish: (s: Submission) => void; onRevise: (s: Submission, note: string) => void }) {
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

function BookForm({ initial, onSave, onClose }: { initial?: Book; onSave: (b: Book) => void; onClose: () => void }) {
  const [f, setF] = useState<Book>(initial ?? { title: "", author: "", shelf: "", stock: 1, department: "Teknik Informatika (TIK)", theme: "Algoritma & RPL", cover: "from-forest to-emerald-800", code: `BARU / ${Date.now().toString().slice(-4)}` });
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
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Btn kind="outline" onClick={onClose}>Batal</Btn>
        <Btn disabled={!f.title.trim() || !f.shelf.trim()} onClick={() => onSave(f)}>Simpan Perubahan</Btn>
      </div>
    </Modal>
  );
}

function Catalog({ items, setItems, toast }: { items: Book[]; setItems: (fn: (b: Book[]) => Book[]) => void; toast: (m: string) => void }) {
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

/* ---------- Shell ---------- */
type NavItem = { key: View; label: string; icon: keyof typeof P; count?: number };
const TIP = "pointer-events-none invisible absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 lg:block";
const ROW = "group relative flex min-h-[42px] w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium tracking-[-0.01em] transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function SideLink({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={item.label} aria-current={active ? "page" : undefined}
      className={`${ROW} ${collapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "bg-accent font-semibold text-forest" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
      <Icon d={item.icon} className="size-5 shrink-0" />
      <span className={`flex-1 truncate text-left ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
      {!!item.count && <span className={`rounded-full px-2 text-[11px] font-bold tabular-nums ${active ? "bg-forest/10" : "bg-white/10"} ${collapsed ? "lg:absolute lg:right-1 lg:top-1 lg:px-1.5" : ""}`}>{item.count}</span>}
      {collapsed && <span role="tooltip" className={TIP}>{item.label}</span>}
    </button>
  );
}

export default function LibrarianPortal({ onLogout }: { onLogout?: () => void }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [students, setStudents] = useState(initialStudents);
  const [fines, setFines] = useState(initialFines);
  const [subs, setSubs] = useState(initialSubs);
  const [items, setItems] = useState<Book[]>(seedBooks);
  const [txCount, setTxCount] = useState(18);
  const [lookup, setLookup] = useState("");
  const [headerQ, setHeaderQ] = useState("");
  const go = (v: View) => { setActiveView(v); setOpen(false); };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Seed counts to match the brief while reflecting live changes.
  const holdCount = 5 - (initialStudents.reduce((n, s) => n + s.holds.length, 0) - students.reduce((n, s) => n + s.holds.length, 0));

  const handover = (nim: string, holdId: string) => {
    const start = new Date(2026, 9, 4);
    const due = new Date(start); due.setDate(due.getDate() + 14);
    setStudents((xs) => xs.map((s) => {
      if (s.nim !== nim) return s;
      const h = s.holds.find((x) => x.id === holdId)!;
      setToast(`"${h.title}" diserahkan. Masa pinjam 14 hari hingga ${fmtDate(due)}.`);
      return {
        ...s,
        holds: s.holds.filter((x) => x.id !== holdId),
        loans: [{ id: `l-${holdId}`, title: h.title, code: h.code, start: fmtDate(start), due: fmtDate(due), daysLeft: 14 }, ...s.loans],
        history: [{ date: fmtDate(start), action: `Peminjaman (dari ${h.pin})`, title: h.title }, ...s.history],
      };
    }));
    setTxCount((c) => c + 1);
  };
  const approve = (f: FineReq) => {
    setFines((xs) => xs.filter((x) => x.id !== f.id));
    setStudents((xs) => xs.map((s) => (s.nim === f.nim ? { ...s, fine: 0, clear: true } : s)));
    setToast(`Denda ${f.name} lunas. Status Bebas Pustaka kini hijau.`);
  };
  const reject = (f: FineReq, note: string) => {
    setFines((xs) => xs.filter((x) => x.id !== f.id));
    setToast(`Bukti ${f.name} ditolak${note ? ` — "${note}"` : ""}. Notifikasi dikirim.`);
  };

  const nav: NavItem[] = [
    { key: "dashboard", label: "Dashboard Operasional", icon: "grid" },
    { key: "sirkulasi", label: "Loket & Lookup NIM", icon: "userCheck", count: holdCount },
    { key: "fines", label: "Verifikasi Denda QRIS", icon: "receipt", count: fines.length },
    { key: "erepo_curation", label: "Kurasi E-Repository", icon: "fileCheck", count: subs.length },
    { key: "catalog", label: "Kelola Katalog & Stok", icon: "books" },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {open && <div className="fixed inset-0 z-30 bg-forest/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-forest p-4 text-white transition-[transform,width] duration-200 lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"} ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`flex items-center justify-between px-1 ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent font-black text-forest">SA</div>
            <div className={isCollapsed ? "lg:hidden" : ""}><p className="font-extrabold tracking-tight">SIPERPUS Admin</p><p className="text-[11px] text-white/50">Politeknik Negeri Lhokseumawe</p></div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Tutup menu"><Icon d="x" /></button>
        </div>
        <span className={`mx-1 mt-5 self-start rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold text-accent ${isCollapsed ? "lg:hidden" : ""}`}>Pustakawan PNL</span>
        <nav aria-label="Navigasi admin" className="mt-6 space-y-1">
          {nav.map((item) => <SideLink key={item.key} item={item} active={activeView === item.key} collapsed={isCollapsed} onClick={() => go(item.key)} />)}
        </nav>
        <div className={`mt-auto rounded-xl bg-white/5 p-4 text-xs text-white/60 ${isCollapsed ? "lg:hidden" : ""}`}>Shift aktif: 08.00–16.30 WIB · Loket 1</div>
        <button onClick={onLogout} aria-label="Keluar Admin" className={`${ROW} mt-3 text-white/80 hover:bg-danger/20 hover:text-white ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Icon d="logout" className="size-5 shrink-0" />
          <span className={`truncate ${isCollapsed ? "lg:hidden" : ""}`}>Keluar Admin</span>
          {isCollapsed && <span role="tooltip" className={TIP}>Keluar Admin</span>}
        </button>
        <button onClick={() => setIsCollapsed((c) => !c)} aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"} aria-expanded={!isCollapsed}
          className="absolute -right-3 top-[34px] hidden size-6 place-items-center rounded-full border border-white/15 bg-forest-light text-white shadow-md transition-[background-color] duration-150 hover:bg-forest-light/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:grid">
          <Icon d={isCollapsed ? "chevR" : "chevL"} className="size-4" />
        </button>
      </aside>

      <div className={`transition-[padding] duration-200 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-emerald-950/10 bg-canvas/85 px-4 py-3 backdrop-blur md:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-white lg:hidden" aria-label="Buka menu"><Icon d="menu" /></button>
          <form className="relative max-w-xl flex-1" onSubmit={(e) => { e.preventDefault(); if (!headerQ.trim()) return; setLookup(headerQ); go("sirkulasi"); setHeaderQ(""); }}>
            <Icon d="search" className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input value={headerQ} onChange={(e) => setHeaderQ(e.target.value)} placeholder="Input NIM atau PIN Hold, e.g. PNL-HOLD-8921..." className="w-full rounded-xl border border-emerald-950/10 bg-white py-2.5 pl-10 pr-14 text-sm outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-accent/30" />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-emerald-950/10 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">Enter</kbd>
          </form>
          <button className="relative ml-auto rounded-xl border border-emerald-950/10 bg-white p-2.5" aria-label="Notifikasi">
            <Icon d="bell" className="size-5" />{fines.length > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-white" />}
          </button>
          <div className="hidden items-center gap-3 md:flex">
            <div className="grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-accent">RH</div>
            <div className="leading-tight"><p className="text-sm font-bold">Rina Hayati</p><p className="text-xs text-muted">Staf Sirkulasi · Lantai 1</p></div>
          </div>
        </header>
        <main className="mx-auto max-w-screen-2xl p-4 md:p-8">
          {activeView === "dashboard" && <Dashboard go={go} txCount={txCount} holdCount={holdCount} fines={fines} subs={subs} />}
          {activeView === "sirkulasi" && <Sirkulasi students={students} query={lookup} setQuery={setLookup} onHandover={handover} />}
          {activeView === "fines" && <Fines fines={fines} onApprove={approve} onReject={reject} />}
          {activeView === "erepo_curation" && <Curation subs={subs}
            onPublish={(s) => { setSubs((xs) => xs.filter((x) => x.id !== s.id)); setToast(`"${s.title}" dipublikasikan ke E-Repository.`); }}
            onRevise={(s) => { setSubs((xs) => xs.filter((x) => x.id !== s.id)); setToast(`Permintaan revisi dikirim ke ${s.author}.`); }} />}
          {activeView === "catalog" && <Catalog items={items} setItems={setItems} toast={setToast} />}
        </main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-forest"><Icon d="check" className="size-4" /></span>
          {toast}
        </div>
      )}
    </div>
  );
}
