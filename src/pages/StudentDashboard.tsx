import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/authContext";
import { supabase } from "../lib/supabase";
import { View } from "../data/portalData";

type DashboardRow = {
  id: string;
  due_date?: string;
  expires_at?: string;
  returned_at?: string | null;
  status?: string;
  books?: { title?: string; category?: string; author?: string; shelf?: string };
};

export function StudentDashboard({ go }: { go: (v: View) => void }) {
  const { user, profile } = useAuth();
  const [loans, setLoans] = useState<DashboardRow[]>([]);
  const [holds, setHolds] = useState<DashboardRow[]>([]);
  const [fines, setFines] = useState<{ amount: number; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("loans").select("id,due_date,returned_at,status,books(title,category,author,shelf)").eq("user_id", user.id),
      supabase.from("holds").select("id,expires_at,status,books(title,category,author,shelf)").eq("user_id", user.id).eq("status", "active"),
      supabase.from("fines").select("amount,status").eq("user_id", user.id),
    ]).then(([loanResult, holdResult, fineResult]) => {
      const firstError = loanResult.error || holdResult.error || fineResult.error;
      if (firstError) setError(firstError.message);
      setLoans((loanResult.data ?? []) as DashboardRow[]);
      setHolds((holdResult.data ?? []) as DashboardRow[]);
      setFines((fineResult.data ?? []) as { amount: number; status: string }[]);
      setLoading(false);
    });
  }, [user]);

  const activeLoans = loans.filter((loan) => !loan.returned_at);
  const outstanding = fines.filter((fine) => fine.status !== "paid").reduce((sum, fine) => sum + Number(fine.amount), 0);
  const nextLoan = useMemo(() => activeLoans.filter((loan) => loan.due_date).sort((a, b) => Date.parse(a.due_date!) - Date.parse(b.due_date!))[0], [activeLoans]);
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    loans.forEach((loan) => {
      const category = loan.books?.category || "Lainnya";
      counts.set(category, (counts.get(category) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [loans]);

  if (loading) return <div className="rounded-2xl border border-emerald-950/10 bg-white p-10 text-center text-sm text-muted">Memuat dashboard...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-sm text-danger">{error}</div>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-light tracking-tight">Selamat datang, <span className="font-semibold text-forest">{profile?.full_name}.</span></h1>
        <p className="mt-1 text-sm text-muted">{profile?.nim ?? "Mahasiswa"} · {profile?.prodi ?? "PNL"}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pinjaman Aktif", activeLoans.length, "buku"],
          ["Hold Aktif", holds.length, "tiket"],
          ["Denda Berjalan", `Rp ${outstanding.toLocaleString("id-ID")}`, ""],
          ["Bebas Pustaka", profile?.clear_status ? "Ya" : "Tidak", ""],
        ].map(([label, value, unit]) => (
          <div key={label} className="rounded-2xl border border-emerald-950/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
            <p className="mt-3 text-2xl font-bold text-forest">{value} <span className="text-sm font-medium text-muted">{unit}</span></p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-emerald-950/10 bg-white p-6">
          <h2 className="font-bold">Jatuh tempo terdekat</h2>
          {nextLoan ? (
            <div className="mt-4"><p className="font-semibold">{nextLoan.books?.title}</p><p className="mt-1 text-sm text-muted">Jatuh tempo {new Date(nextLoan.due_date!).toLocaleDateString("id-ID")}</p></div>
          ) : <p className="mt-4 text-sm text-muted">Tidak ada pinjaman aktif.</p>}
        </section>
        <section className="rounded-2xl border border-emerald-950/10 bg-white p-6">
          <h2 className="font-bold">Hold aktif</h2>
          {holds.length ? holds.map((hold) => <div key={hold.id} className="mt-4 flex justify-between gap-4 text-sm"><span className="font-semibold">{hold.books?.title}</span><span className="text-muted">{hold.expires_at ? `s.d. ${new Date(hold.expires_at).toLocaleDateString("id-ID")}` : "Aktif"}</span></div>) : <p className="mt-4 text-sm text-muted">Belum ada reservasi aktif.</p>}
        </section>
      </div>
      <section className="rounded-2xl border border-emerald-950/10 bg-white p-6">
        <div className="flex items-center justify-between"><h2 className="font-bold">Analitik koleksi</h2><button onClick={() => go("circulation")} className="text-sm font-semibold text-forest hover:underline">Lihat sirkulasi</button></div>
        {genres.length ? <div className="mt-4 flex flex-wrap gap-3">{genres.map(([genre, count]) => <span key={genre} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-forest">{genre}: {count}</span>)}</div> : <p className="mt-4 text-sm text-muted">Belum ada riwayat peminjaman untuk dianalisis.</p>}
      </section>
    </div>
  );
}
