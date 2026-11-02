import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { supabase } from "../lib/supabase";

type FineRow = { id: string; amount: number; days_late: number; status: "unpaid" | "pending_verification" | "paid"; receipt_url?: string | null; rejection_note?: string | null; loans?: { due_date?: string; books?: { title?: string } } };

export function Fines() {
  const { user } = useAuth();
  const [fines, setFines] = useState<FineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data, error: queryError } = await supabase.from("fines").select("id,amount,days_late,status,receipt_url,rejection_note,loans(due_date,books(title))").eq("user_id", user.id).order("created_at", { ascending: false });
    setError(queryError?.message ?? null);
    setFines((data ?? []) as FineRow[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, [user]);

  const uploadReceipt = async (fine: FineRow, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setUploading(fine.id);
    const path = `${user.id}/${fine.id}-${Date.now()}-${file.name}`;
    const uploadResult = await supabase.storage.from("qris-receipts").upload(path, file, { upsert: false });
    if (uploadResult.error) setError(uploadResult.error.message);
    else {
      const { error: updateError } = await supabase.from("fines").update({ receipt_url: path, status: "pending_verification" }).eq("id", fine.id).eq("user_id", user.id).eq("status", "unpaid");
      if (updateError) setError(updateError.message);
      else await load();
    }
    setUploading(null);
  };

  if (loading) return <div className="rounded-2xl border border-emerald-950/10 bg-white p-10 text-center text-sm text-muted">Memuat denda...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-sm text-danger">{error}</div>;
  const outstanding = fines.filter((fine) => fine.status !== "paid").reduce((sum, fine) => sum + Number(fine.amount), 0);

  return (
    <div className="space-y-5">
      <header><p className="text-xs font-bold uppercase tracking-wider text-forest">Keuangan</p><h1 className="mt-1 text-2xl font-black">Denda & pembayaran</h1></header>
      <div className="rounded-2xl border border-emerald-950/10 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Total belum lunas</p><p className="mt-2 text-2xl font-bold text-danger">Rp {outstanding.toLocaleString("id-ID")}</p></div>
      {fines.length ? fines.map((fine) => <article key={fine.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold">{fine.loans?.books?.title ?? "Denda perpustakaan"}</h2><p className="mt-1 text-sm text-muted">{fine.days_late} hari terlambat · Rp {Number(fine.amount).toLocaleString("id-ID")}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${fine.status === "paid" ? "bg-success-soft text-success" : fine.status === "pending_verification" ? "bg-accent-soft text-forest" : "bg-danger-soft text-danger"}`}>{fine.status === "paid" ? "Lunas" : fine.status === "pending_verification" ? "Menunggu verifikasi" : "Belum dibayar"}</span></div>{fine.rejection_note && <p className="mt-3 text-sm text-danger">{fine.rejection_note}</p>}{fine.status === "unpaid" && <label className="mt-4 inline-flex cursor-pointer rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white">{uploading === fine.id ? "Mengunggah..." : "Upload bukti QRIS"}<input type="file" accept="image/*,application/pdf" className="hidden" onChange={(event) => void uploadReceipt(fine, event)} disabled={uploading !== null} /></label>}</article>) : <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center text-sm text-muted">Tidak ada denda.</div>}
    </div>
  );
}
