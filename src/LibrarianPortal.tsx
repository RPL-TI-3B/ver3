import { useEffect, useState } from "react";
import { BooksView } from "./pages/CatalogPage";
import { RepositoryView } from "./pages/RepositoryPage";
import { Catalog } from "./pages/LibrarianCatalog";
import { Curation } from "./pages/LibrarianCuration";
import { Fines } from "./pages/LibrarianFines";
import { Sirkulasi } from "./pages/LibrarianSirkulasi";
import { Dashboard } from "./pages/LibrarianDashboard";
import { useBooks } from "./lib/useSupabaseData";
import { supabase } from "./lib/supabase";
import { UserProfile } from "./lib/authContext";
import { View, Student, Hold, Loan, FineReq, Submission, fmtDate } from "./data/librarianData";
import { Icon, SideLink, ROW, TIP, NavItem } from "./pages/LibrarianShared";

type LookupPayload = {
  profile: { id: string; nim: string | null; full_name: string; prodi: string | null; clear_status: boolean };
  holds: Array<{ id: string; pin: string; expires_at: string; status: string; book: { title: string; code: string; shelf: string } }>;
  loans: Array<{ id: string; borrowed_at: string; due_date: string; returned_at: string | null; status: string; book: { title: string; code: string } }>;
  fines: Array<{ amount: number; status: string }>;
};

const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data.";

export default function LibrarianPortal({ profile, onLogout }: { profile: UserProfile; onLogout: () => Promise<void> }) {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [open, setOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lookup, setLookup] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [fines, setFines] = useState<FineReq[]>([]);
  const [finesLoading, setFinesLoading] = useState(true);
  const [finesError, setFinesError] = useState<string | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ transactions: 0, holds: 0, fines: 0, submissions: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const { books, setBooks, refetch: refetchBooks } = useBooks();
  const go = (view: View) => { setActiveView(view); setOpen(false); };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadFines = async () => {
    setFinesLoading(true);
    const { data, error } = await supabase.from("fines").select("id,amount,receipt_url,rejection_note,created_at,status,student:profiles!fines_user_id_fkey(nim,full_name,prodi)").eq("status", "pending_verification").order("created_at", { ascending: false });
    if (error) setFinesError(error.message);
    const rows = (data ?? []) as unknown as Array<{ id: string; amount: number; receipt_url: string | null; rejection_note: string | null; created_at: string; student: { nim: string | null; full_name: string; prodi: string | null } | null }>;
    setFines(rows.map((fine) => { const student = fine.student; return { id: fine.id, nim: student?.nim ?? "-", name: student?.full_name ?? "Mahasiswa", major: student?.prodi ?? "PNL", reason: "Keterlambatan pengembalian", amount: Number(fine.amount), uploaded: new Date(fine.created_at).toLocaleString("id-ID"), ref: fine.id, receiptUrl: fine.receipt_url, rejectionNote: fine.rejection_note }; }));
    setFinesLoading(false);
  };

  const loadSubs = async () => {
    setSubsLoading(true);
    const { data, error } = await supabase.from("repository_items").select("id,title,type,category,file_size,pdf_url,profiles(full_name,prodi)").eq("status", "pending_curation").order("created_at", { ascending: false });
    if (error) setSubsError(error.message);
    const rows = (data ?? []) as unknown as Array<{ id: string; title: string; type: string; category: "fiction" | "nonfiction"; file_size: string | null; pdf_url: string | null; profiles: Array<{ full_name: string; prodi: string | null }> | null }>;
    const mapped: Submission[] = await Promise.all(rows.map(async (item) => {
      let pdfUrl: string | null = null;
      if (item.pdf_url) {
        const { data: signed } = await supabase.storage.from("repository-files").createSignedUrl(item.pdf_url, 3600);
        pdfUrl = signed?.signedUrl ?? null;
      }
      const author = item.profiles?.[0];
      return { id: item.id, title: item.title, author: author?.full_name ?? "Mahasiswa", major: author?.prodi ?? "PNL", size: item.file_size ?? "Ukuran tidak tersedia", category: item.category === "fiction" ? "Fiksi" : "Non-Fiksi", type: item.type, pdfUrl };
    }));
    setSubs(mapped);
    setSubsLoading(false);
  };

  const loadMetrics = async () => {
    setMetricsLoading(true);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const [transactions, holds, pendingFines, pendingSubs] = await Promise.all([
      supabase.from("loans").select("id,borrowed_at,returned_at").or(`borrowed_at.gte.${start.toISOString()},returned_at.gte.${start.toISOString()}`),
      supabase.from("holds").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("fines").select("id", { count: "exact", head: true }).eq("status", "pending_verification"),
      supabase.from("repository_items").select("id", { count: "exact", head: true }).eq("status", "pending_curation"),
    ]);
    const firstError = transactions.error || holds.error || pendingFines.error || pendingSubs.error;
    if (firstError) setMetricsError(firstError.message);
    setMetrics({ transactions: new Set((transactions.data ?? []).map((row) => row.id)).size, holds: holds.count ?? 0, fines: pendingFines.count ?? 0, submissions: pendingSubs.count ?? 0 });
    setMetricsLoading(false);
  };

  useEffect(() => { void Promise.all([loadFines(), loadSubs(), loadMetrics()]); }, []);

  const searchStudent = async (identifier: string) => {
    setLookup(identifier);
    setLookupLoading(true);
    setLookupError(null);
    const { data, error } = await supabase.rpc("lookup_librarian", { identifier: identifier.trim() });
    if (error) setLookupError(error.message);
    const payload = data as LookupPayload | null;
    if (!payload) setStudent(null);
    else {
      const activeHolds: Hold[] = payload.holds.filter((hold) => hold.status === "active").map((hold) => ({ id: hold.id, pin: hold.pin, title: hold.book.title, code: hold.book.code, shelf: hold.book.shelf, expires: fmtDate(new Date(hold.expires_at)), expires_at: hold.expires_at }));
      const loans: Loan[] = payload.loans.map((loan) => ({ id: loan.id, title: loan.book.title, code: loan.book.code, start: fmtDate(new Date(loan.borrowed_at)), due: fmtDate(new Date(loan.due_date)), daysLeft: Math.ceil((Date.parse(loan.due_date) - Date.now()) / 86400000), returned_at: loan.returned_at }));
      setStudent({ id: payload.profile.id, nim: payload.profile.nim ?? "-", name: payload.profile.full_name, major: payload.profile.prodi ?? "PNL", holds: activeHolds, loans, history: payload.loans.filter((loan) => loan.returned_at).map((loan) => ({ date: fmtDate(new Date(loan.returned_at!)), action: "Pengembalian", title: loan.book.title })), fine: payload.fines.filter((fine) => fine.status !== "paid").reduce((sum, fine) => sum + Number(fine.amount), 0), clear: payload.profile.clear_status });
    }
    setLookupLoading(false);
  };

  const handover = async (holdId: string) => {
    const { error } = await supabase.rpc("handover_hold", { hold_id: holdId });
    setToast(error ? error.message : "Buku berhasil diserahkan.");
    if (!error) { await searchStudent(lookup); await loadMetrics(); }
  };
  const returnLoan = async (loanId: string) => {
    const { error } = await supabase.rpc("return_loan", { loan_id: loanId });
    setToast(error ? error.message : "Pengembalian berhasil dicatat.");
    if (!error) { await searchStudent(lookup); await Promise.all([loadMetrics(), loadFines()]); }
  };
  const approveFine = async (fine: FineReq) => {
    const { error } = await supabase.rpc("approve_fine", { fine_id: fine.id });
    setToast(error ? error.message : "Denda disetujui.");
    if (!error) await Promise.all([loadFines(), loadMetrics()]);
  };
  const rejectFine = async (fine: FineReq, note: string) => {
    const { error } = await supabase.rpc("reject_fine", { fine_id: fine.id, note });
    setToast(error ? error.message : "Bukti pembayaran ditolak.");
    if (!error) await loadFines();
  };
  const publish = async (submission: Submission) => {
    const { error } = await supabase.from("repository_items").update({ status: "published", reviewer_notes: null }).eq("id", submission.id);
    setToast(error ? error.message : "Karya dipublikasikan.");
    if (!error) await Promise.all([loadSubs(), loadMetrics()]);
  };
  const revise = async (submission: Submission, note: string) => {
    const { error } = await supabase.from("repository_items").update({ status: "revision_needed", reviewer_notes: note }).eq("id", submission.id);
    setToast(error ? error.message : "Permintaan revisi dikirim.");
    if (!error) await Promise.all([loadSubs(), loadMetrics()]);
  };

  const nav: NavItem[] = [
    { key: "dashboard", label: "Dashboard Operasional", icon: "grid" },
    { key: "sirkulasi", label: "Loket & Lookup NIM", icon: "userCheck", count: metrics.holds },
    { key: "fines", label: "Verifikasi Denda QRIS", icon: "receipt", count: metrics.fines },
    { key: "erepo_curation", label: "Kurasi E-Repository", icon: "fileCheck", count: metrics.submissions },
    { key: "catalog", label: "Kelola Katalog & Stok", icon: "books" },
  ];

  return <div className="min-h-screen bg-canvas text-ink">
    {open && <div className="fixed inset-0 z-30 bg-forest/50 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-forest p-4 text-white transition-[transform,width] duration-200 lg:translate-x-0 ${isCollapsed ? "lg:w-20" : "lg:w-72"} ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className={`flex items-center justify-between px-1 ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}><div className="flex items-center gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent font-black text-forest">SA</div><div className={isCollapsed ? "lg:hidden" : ""}><p className="font-extrabold tracking-tight">SIPERPUS Admin</p><p className="text-[11px] text-white/50">Politeknik Negeri Lhokseumawe</p></div></div><button onClick={() => setOpen(false)} className="lg:hidden" aria-label="Tutup menu"><Icon d="x" /></button></div>
      <span className={`mx-1 mt-5 self-start rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold text-accent ${isCollapsed ? "lg:hidden" : ""}`}>Pustakawan PNL</span>
      <nav aria-label="Navigasi admin" className="mt-6 space-y-1">{nav.map((item) => <SideLink key={item.key} item={item} active={activeView === item.key} collapsed={isCollapsed} onClick={() => go(item.key)} />)}</nav>
      <button onClick={() => void onLogout()} aria-label="Keluar Admin" className={`${ROW} mt-auto text-white/80 hover:bg-danger/20 hover:text-white ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}><Icon d="logout" className="size-5 shrink-0" /><span className={`truncate ${isCollapsed ? "lg:hidden" : ""}`}>Keluar Admin</span>{isCollapsed && <span role="tooltip" className={TIP}>Keluar Admin</span>}</button>
      <button onClick={() => setIsCollapsed((value) => !value)} aria-label={isCollapsed ? "Perluas sidebar" : "Ciutkan sidebar"} aria-expanded={!isCollapsed} className="absolute -right-3 top-[34px] hidden size-6 place-items-center rounded-full border border-white/15 bg-forest-light text-white shadow-md lg:grid"><Icon d={isCollapsed ? "chevR" : "chevL"} className="size-4" /></button>
    </aside>
    <div className={`transition-[padding] duration-200 ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-emerald-950/10 bg-canvas/85 px-4 py-3 backdrop-blur md:px-8"><button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-white lg:hidden" aria-label="Buka menu"><Icon d="menu" /></button><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-forest text-sm font-bold text-accent">{profile.full_name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</div><div className="hidden leading-tight md:block"><p className="text-sm font-bold">{profile.full_name}</p><p className="text-xs text-muted">{profile.nim ?? "Pustakawan"} · {profile.prodi ?? "UPT Perpustakaan"}</p></div></div></header>
      <main className="mx-auto max-w-screen-2xl p-4 md:p-8">
        {activeView === "dashboard" && <Dashboard go={go} loading={metricsLoading} error={metricsError} metrics={metrics} />}
        {activeView === "sirkulasi" && <Sirkulasi student={student} query={lookup} setQuery={setLookup} loading={lookupLoading} error={lookupError} onSearch={searchStudent} onHandover={handover} onReturn={returnLoan} />}
        {activeView === "fines" && <Fines fines={fines} loading={finesLoading} error={finesError} onApprove={approveFine} onReject={rejectFine} />}
        {activeView === "erepo_curation" && <Curation subs={subs} loading={subsLoading} error={subsError} onPublish={publish} onRevise={revise} />}
        {activeView === "catalog" && <Catalog items={books} setItems={setBooks} toast={setToast} refetch={refetchBooks} />}
      </main>
    </div>
    {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-white shadow-2xl"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-forest"><Icon d="check" className="size-4" /></span>{toast}</div>}
  </div>;
}
