import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { supabase } from "../lib/supabase";

type Row = { id: string; borrowed_at?: string; due_date?: string; returned_at?: string | null; expires_at?: string; pin?: string; status: string; books?: { title?: string; author?: string; shelf?: string } };

export function Circulation() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"active" | "hold" | "history">("active");
  const [loans, setLoans] = useState<Row[]>([]);
  const [holds, setHolds] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [loanResult, holdResult] = await Promise.all([
      supabase.from("loans").select("id,borrowed_at,due_date,returned_at,status,books(title,author,shelf)").eq("user_id", user.id).order("borrowed_at", { ascending: false }),
      supabase.from("holds").select("id,expires_at,pin,status,books(title,author,shelf)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    const firstError = loanResult.error || holdResult.error;
    setError(firstError?.message ?? null);
    setLoans((loanResult.data ?? []) as Row[]);
    setHolds((holdResult.data ?? []) as Row[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, [user]);

  if (loading) return <div className="rounded-2xl border border-emerald-950/10 bg-white p-10 text-center text-sm text-muted">Memuat sirkulasi...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-sm text-danger">{error}</div>;
  const active = loans.filter((loan) => !loan.returned_at);
  const history = loans.filter((loan) => loan.returned_at);
  const list = tab === "active" ? active : tab === "hold" ? holds : history;

  return (
    <div className="space-y-5">
      <header><p className="text-xs font-bold uppercase tracking-wider text-forest">Sirkulasi Buku</p><h1 className="mt-1 text-2xl font-black">Peminjaman & reservasi</h1></header>
      <div className="flex flex-wrap gap-2 rounded-xl bg-white p-1 shadow-sm">
        {([["active", `Sedang Dipinjam (${active.length})`], ["hold", `Hold (${holds.length})`], ["history", `Riwayat (${history.length})`]] as const).map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === key ? "bg-forest text-white" : "text-muted hover:bg-canvas"}`}>{label}</button>)}
      </div>
      {list.length ? list.map((item) => (
        <article key={item.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{item.books?.title ?? "Buku"}</h2><p className="mt-1 text-sm text-muted">{item.books?.author ?? "Penulis tidak tersedia"} · {item.books?.shelf ?? "Rak tidak tersedia"}</p></div><span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-forest">{tab === "hold" ? "Hold aktif" : item.returned_at ? "Selesai" : "Dipinjam"}</span></div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {item.borrowed_at && <span>Dipinjam {new Date(item.borrowed_at).toLocaleDateString("id-ID")}</span>}
            {item.due_date && <span>Jatuh tempo {new Date(item.due_date).toLocaleDateString("id-ID")}</span>}
            {item.returned_at && <span>Dikembalikan {new Date(item.returned_at).toLocaleDateString("id-ID")}</span>}
            {item.expires_at && <span>Kedaluwarsa {new Date(item.expires_at).toLocaleDateString("id-ID")}</span>}
            {item.pin && <span className="font-mono">{item.pin}</span>}
          </div>
        </article>
      )) : <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center text-sm text-muted">Belum ada data pada tab ini.</div>}
    </div>
  );
}
