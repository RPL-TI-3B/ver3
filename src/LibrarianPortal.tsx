import { useEffect, useState, type ReactNode } from "react";
import { BooksView } from "./pages/CatalogPage";
import { RepositoryView } from "./pages/RepositoryPage";
import { Catalog } from "./pages/LibrarianCatalog";
import { BookForm } from "./pages/LibrarianBookForm";
import { Curation } from "./pages/LibrarianCuration";
import { Fines } from "./pages/LibrarianFines";
import { Sirkulasi } from "./pages/LibrarianSirkulasi";
import { Dashboard } from "./pages/LibrarianDashboard";
import { books as seedBooks } from "./data/mockData";
import { type Book } from "./types";

import { View, CircTab, CatalogTab, Student, FineReq, Submission, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "./data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./pages/LibrarianShared";

/* ---------- Icons (fine-line) ---------- */

/* ---------- Atoms (mirrors StudentPortal) ---------- */

/* ---------- Data ---------- */








/* ---------- Views ---------- */







/* ---------- Shell ---------- */


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
