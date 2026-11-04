import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { supabase } from "../lib/supabase";
import { Icon, Modal, rupiah } from "./StudentShared";
import { QrisMock } from "./QrisMock";

type FineRow = {
  id: string;
  amount: number;
  days_late: number;
  status: "unpaid" | "pending_verification" | "paid";
  receipt_url?: string | null;
  rejection_note?: string | null;
  loans?: { due_date?: string; books?: { title?: string } };
};

const statusLabel = { unpaid: "Belum dibayar", pending_verification: "Menunggu verifikasi", paid: "Lunas" } as const;
const statusTone = {
  unpaid: "bg-danger-soft text-danger",
  pending_verification: "bg-accent-soft text-forest",
  paid: "bg-success-soft text-success",
} as const;

export function Fines() {
  const { user } = useAuth();
  const [fines, setFines] = useState<FineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<FineRow | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const { data, error: queryError } = await supabase
      .from("fines")
      .select("id,amount,days_late,status,receipt_url,rejection_note,loans(due_date,books(title))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setError(queryError?.message ?? null);
    setFines((data ?? []) as FineRow[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, [user]);

  const openPay = (fine: FineRow) => {
    setPaying(fine);
    setFile(null);
    setModalError(null);
  };

  const closePay = () => {
    if (uploading) return;
    setPaying(null);
    setFile(null);
    setModalError(null);
  };

  const validateFile = (picked?: File) => {
    if (!picked) return;
    if (!/^image\/|application\/pdf/.test(picked.type)) return setModalError("Format harus JPG, PNG, atau PDF.");
    if (picked.size > 5 * 1024 * 1024) return setModalError("Ukuran file melebihi 5 MB.");
    setModalError(null);
    setFile(picked);
  };

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => validateFile(event.target.files?.[0]);

  const submitReceipt = async (event: FormEvent) => {
    event.preventDefault();
    if (!paying || !file || !user) return;
    setUploading(true);
    setModalError(null);
    const path = `${user.id}/${paying.id}-${Date.now()}-${file.name}`;
    const uploadResult = await supabase.storage.from("qris-receipts").upload(path, file, { upsert: false });
    if (uploadResult.error) {
      setModalError(uploadResult.error.message);
    } else {
      const { error: updateError } = await supabase
        .from("fines")
        .update({ receipt_url: path, status: "pending_verification" })
        .eq("id", paying.id)
        .eq("user_id", user.id)
        .eq("status", "unpaid");
      if (updateError) setModalError(updateError.message);
      else {
        setPaying(null);
        setFile(null);
        await load();
      }
    }
    setUploading(false);
  };

  const viewReceipt = async (fine: FineRow) => {
    if (!fine.receipt_url) return;
    const { data, error: signError } = await supabase.storage.from("qris-receipts").createSignedUrl(fine.receipt_url, 300);
    if (signError || !data?.signedUrl) setError(signError?.message ?? "Bukti tidak dapat dibuka.");
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) return <div className="rounded-2xl border border-emerald-950/10 bg-white p-10 text-center text-sm text-muted">Memuat denda...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-sm text-danger">{error}</div>;

  const outstanding = fines.filter((fine) => fine.status !== "paid").reduce((sum, fine) => sum + Number(fine.amount), 0);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-forest">Keuangan</p>
        <h1 className="mt-1 text-2xl font-black">Denda &amp; pembayaran QRIS</h1>
        <p className="mt-1 text-sm text-muted">Bayar denda lewat QRIS, lalu unggah bukti pembayaran untuk diverifikasi pustakawan.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-950/10 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Total belum lunas</p>
          <p className="mt-2 text-2xl font-bold text-danger">{rupiah(outstanding)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-950/10 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Status Bebas Pustaka</p>
          <p className={`mt-2 text-2xl font-bold ${outstanding > 0 ? "text-danger" : "text-success"}`}>{outstanding > 0 ? "Belum bebas" : "Bebas pustaka"}</p>
        </div>
      </div>

      {fines.length ? <div className="space-y-4">{fines.map((fine) => (
        <article key={fine.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">{fine.loans?.books?.title ?? "Denda perpustakaan"}</h2>
              <p className="mt-1 text-sm text-muted">{fine.days_late} hari terlambat · {rupiah(Number(fine.amount))}</p>
              {fine.loans?.due_date && <p className="mt-1 text-xs text-muted">Jatuh tempo {new Date(fine.loans.due_date).toLocaleDateString("id-ID")}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[fine.status]}`}>{statusLabel[fine.status]}</span>
          </div>

          {fine.rejection_note && <p className="mt-3 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{fine.rejection_note}</p>}

          {fine.status === "unpaid" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => openPay(fine)} className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-light">
                <Icon d="receipt" className="size-4" /> Bayar QRIS
              </button>
              {fine.receipt_url && (
                <button onClick={() => void viewReceipt(fine)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-950/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-forest/30 hover:bg-canvas">
                  <Icon d="eye" className="size-4" /> Lihat bukti
                </button>
              )}
            </div>
          )}

          {fine.status === "pending_verification" && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent-soft px-3 py-2 text-sm font-semibold text-forest">
                <Icon d="clock" className="size-4" /> Menunggu verifikasi pustakawan
              </span>
              {fine.receipt_url && (
                <button onClick={() => void viewReceipt(fine)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-950/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-forest/30 hover:bg-canvas">
                  <Icon d="eye" className="size-4" /> Lihat bukti
                </button>
              )}
            </div>
          )}

          {fine.status === "paid" && <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-sm font-semibold text-success"><Icon d="check" className="size-4" /> Denda sudah lunas</p>}
        </article>
      ))}</div> : <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-12 text-center text-sm text-muted">Tidak ada denda. Kamu bebas pustaka 🎉</div>}

      {paying && (
        <Modal onClose={closePay}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Pembayaran Denda</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0d372b]">Bayar dengan QRIS</h3>
          <div className="mt-5 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
              <span className="text-sm font-black italic tracking-tight text-slate-900">QRIS</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Bank Aceh Syariah</span>
            </div>
            <div className="flex flex-col items-center px-4 py-5">
              <p className="text-sm font-semibold text-slate-900">UPT Perpustakaan PNL</p>
              <p className="font-mono text-[10px] text-slate-400">NMID: ID1026318842107</p>
              <div className="mt-3"><QrisMock /></div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-slate-400">Total Bayar</p>
              <p className="text-2xl font-semibold text-[#0d372b] tabular-nums">{rupiah(Number(paying.amount))}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">Scan memakai M-Banking / GoPay / OVO / Dana, lalu unggah bukti pembayaran di bawah.</p>
          <p className="mt-2 truncate text-xs text-slate-400">Denda: {paying.loans?.books?.title ?? "Perpustakaan"} · {paying.days_late} hari</p>

          <form onSubmit={(event) => void submitReceipt(event)}>
            <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); validateFile(event.dataTransfer.files[0]); }} className="mt-5 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-slate-200 px-6 py-7 text-center transition hover:border-slate-300 hover:bg-slate-50/60">
              <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={pickFile} />
              <span className="grid size-10 place-items-center rounded-full border border-slate-200 text-[#0d372b]/70"><Icon d="upload" className="size-4" /></span>
              {file ? (
                <><p className="mt-3 max-w-full truncate text-sm font-medium text-slate-900">{file.name}</p><p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB · klik untuk ganti</p></>
              ) : (
                <><p className="mt-3 text-sm font-medium text-slate-700">Tarik struk ke sini atau <span className="text-[#0d372b] underline underline-offset-2">pilih file</span></p><p className="mt-1 text-xs text-slate-400">JPG, PNG, atau PDF · maks. 5 MB</p></>
              )}
            </label>
            {modalError && <p className="mt-2 text-xs text-red-600">{modalError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closePay} disabled={uploading} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Batal</button>
              <button type="submit" disabled={!file || uploading} className="rounded-lg bg-[#0d372b] px-4 py-2 text-sm font-medium text-white hover:bg-[#155f46] disabled:bg-slate-100 disabled:text-slate-400">{uploading ? "Mengunggah..." : "Kirim untuk Verifikasi"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
