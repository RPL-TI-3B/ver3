import { useEffect, useState, type ReactNode } from "react";
import { BooksView } from "./pages/CatalogPage";
import { RepositoryView } from "./pages/RepositoryPage";
import { View } from "./data/portalData";
import { StudentDashboard } from "./pages/StudentDashboard";
import { P } from "./pages/StudentShared";
import { ERepo } from "./pages/StudentERepo";
import { Circulation } from "./pages/StudentCirculation";
import { Fines } from "./pages/StudentFines";
import { QrisMock } from "./pages/QrisMock";
import { Icon, Badge, Modal, UploadModal, QrisModal, Cover, Title, Stat, useCountdown, btnPrimary, btnSecondary, btnGhost, card, FINE_RATE, rupiah } from "./pages/StudentShared";



/* ---------- Icons ---------- */

/* ---------- Data ---------- */
const books: { t: string; a: string; y: number; k: string; s: number; c: string }[] = [];
const papers: { t: string; a: string; y: number; j: string; dl: number }[] = [];

/* ---------- UI atoms ---------- */


/* ---------- Fines ---------- */
type FineState = "unpaid" | "pending_verification" | "rejected";
type Fine = { id: string; b: (typeof books)[number]; from: string; due: string; returned: string; late: number; state: FineState; file?: string };








/* ---------- Shell ---------- */
type NavItem = { key: View; label: string; icon: keyof typeof P };

const TIP = "pointer-events-none invisible absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 lg:block";
const ROW = "group relative flex min-h-[42px] w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium tracking-[-0.01em] transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function SideLink({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={`${ROW} ${collapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "bg-accent font-semibold text-forest" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
    >
      <Icon d={item.icon} className="size-5 shrink-0" />
      <span className={`truncate text-left ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
      {collapsed && <span role="tooltip" className={TIP}>{item.label}</span>}
    </button>
  );
}





export default function StudentPortal({ onLogout }: { onLogout?: () => void }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const go = (v: View) => { setActiveView(v); setOpen(false); };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleStudentReserve = () => setToast("Reservasi berhasil. Tiket hold 3 hari tersedia di Dashboard Utama.");
  const handleStudentDownload = () => setToast("Unduhan PDF dimulai. Tercatat di Riwayat Unduhan Anda.");

  const dashboard: NavItem = { key: "dashboard", label: "Dashboard", icon: "grid" };
  const catalog: NavItem[] = [
    { key: "catalog_books", label: "Buku Fisik", icon: "books" },
    { key: "catalog_erepo", label: "E-Repository", icon: "layers" },
  ];
  const others: NavItem[] = [
    { key: "circulation", label: "Sirkulasi", icon: "clock" },
    { key: "erepo_student", label: "Unggah Karya", icon: "file" },
  ];
  const link = (item: NavItem) => (
    <SideLink key={item.key} item={item} active={activeView === item.key} collapsed={isCollapsed} onClick={() => go(item.key)} />
  );

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {open && <div className="fixed inset-0 z-30 bg-forest/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-forest p-4 text-white transition-[transform,width] duration-200 lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"} ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`flex items-center justify-between px-1 ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent font-black text-forest">SR</div>
            <div className={isCollapsed ? "lg:hidden" : ""}><p className="font-extrabold tracking-tight">SIPERPUS-REPO</p><p className="text-[11px] text-white/50">Politeknik Negeri Lhokseumawe</p></div>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Tutup menu"><Icon d="x" /></button>
        </div>
        <span className={`mx-1 mt-5 self-start rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold text-accent ${isCollapsed ? "lg:hidden" : ""}`}>Mahasiswa PNL</span>
        <nav aria-label="Navigasi utama" className="mt-6 space-y-1">
          {link(dashboard)}
          <p className={`my-3 px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 ${isCollapsed ? "lg:hidden" : ""}`}>Jelajahi Katalog</p>
          {isCollapsed && <div className="mx-3 my-3 hidden border-t border-white/15 lg:block" />}
          <div className={`space-y-1 ${isCollapsed ? "" : "lg:ml-5 lg:border-l lg:border-white/10 lg:pl-2"}`}>{catalog.map(link)}</div>
          {isCollapsed && <div className="mx-3 my-3 hidden border-t border-white/15 lg:block" />}
          <div className="space-y-1 pt-1">{others.map(link)}</div>
        </nav>
        <div className={`mt-auto rounded-xl bg-white/5 p-4 text-xs text-white/60 ${isCollapsed ? "lg:hidden" : ""}`}>Jam layanan: Senin–Jumat, 08.00–16.30 WIB</div>
        <button onClick={onLogout} aria-label="Keluar SSO" className={`${ROW} mt-3 text-white/80 hover:bg-danger/20 hover:text-white ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Icon d="logout" className="size-5 shrink-0" />
          <span className={`truncate ${isCollapsed ? "lg:hidden" : ""}`}>Keluar SSO</span>
          {isCollapsed && <span role="tooltip" className={TIP}>Keluar SSO</span>}
        </button>
        <button
          onClick={() => setIsCollapsed((c) => !c)}
          aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          aria-expanded={!isCollapsed}
          className="absolute -right-3 top-[34px] hidden size-6 place-items-center rounded-full border border-white/15 bg-forest-light text-white shadow-md transition-[background-color] duration-150 hover:bg-forest-light/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:grid"
        >
          <Icon d={isCollapsed ? "chevR" : "chevL"} className="size-4" />
        </button>
      </aside>

      <div className={`transition-[padding] duration-200 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-emerald-950/10 bg-canvas/85 px-4 py-3 backdrop-blur md:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-white lg:hidden" aria-label="Buka menu"><Icon d="menu" /></button>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-accent">AM</div>
            <div className="leading-tight"><p className="text-sm font-bold">Halo, Ammar</p><p className="text-xs text-muted">Teknik Informatika</p></div>
          </div>
          <button className="relative ml-auto rounded-xl border border-emerald-950/10 bg-white p-2.5" aria-label="Notifikasi">
            <Icon d="bell" className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
        </header>
        <main className="mx-auto max-w-screen-2xl p-4 md:p-8">
          {activeView === "dashboard" && <StudentDashboard go={go} />}
          {activeView === "catalog_books" && <BooksView onReserve={handleStudentReserve} />}
          {activeView === "catalog_erepo" && <RepositoryView onDownload={handleStudentDownload} />}
          {activeView === "circulation" && <Circulation />}
          {activeView === "erepo_student" && <ERepo />}
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