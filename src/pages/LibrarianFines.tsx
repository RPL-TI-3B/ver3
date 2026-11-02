import { useState } from "react";
import { FineReq, rupiah } from "../data/librarianData";
import { supabase } from "../lib/supabase";
import { Icon, Badge, Btn, PageHead, Modal, card, input } from "./LibrarianShared";

export function Fines({ fines, loading, error, onApprove, onReject }: { fines: FineReq[]; loading: boolean; error: string | null; onApprove: (fine: FineReq) => void; onReject: (fine: FineReq, note: string) => void }) {
  const [open, setOpen] = useState<FineReq | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const showReceipt = async (fine: FineReq) => {
    setOpen(fine);
    setReceiptUrl(null);
    if (fine.receiptUrl) {
      const { data } = await supabase.storage.from("qris-receipts").createSignedUrl(fine.receiptUrl, 300);
      setReceiptUrl(data?.signedUrl ?? null);
    }
  };
  const close = () => { setOpen(null); setRejecting(false); setNote(""); setReceiptUrl(null); };
  return (
    <>
      <PageHead eyebrow="Keuangan Perpustakaan" title="Verifikasi Denda QRIS" sub="Cocokkan bukti pembayaran sebelum menyetel denda lunas." />
      {error && <p role="alert" className="mb-4 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</p>}
      <div className={`${card} overflow-hidden`}>
        {loading && <p className="p-10 text-center text-sm text-muted">Memuat antrean denda...</p>}
        {!loading && fines.length === 0 && <p className="p-10 text-center text-sm text-muted">Tidak ada struk yang menunggu verifikasi.</p>}
        {!loading && fines.map((fine) => <div key={fine.id} className="grid gap-3 border-b border-emerald-950/10 px-5 py-4 last:border-0 md:grid-cols-[1.4fr_1.6fr_0.8fr_1fr_auto] md:items-center md:gap-4"><div><p className="font-semibold">{fine.name}</p><p className="font-mono text-xs text-muted">{fine.nim}</p></div><p className="text-sm text-muted">{fine.reason}</p><p className="font-bold tabular-nums">{rupiah(fine.amount)}</p><Badge tone="amber">Menunggu Verifikasi</Badge><Btn kind="outline" className="w-28" onClick={() => void showReceipt(fine)}><Icon d="eye" className="size-4" />Lihat Struk</Btn></div>)}
      </div>
      {open && <Modal title="Bukti Pembayaran QRIS" onClose={close} wide><div className="grid gap-6 md:grid-cols-[1fr_1.1fr]"><div className="rounded-xl border border-emerald-950/10 bg-canvas p-5">{receiptUrl ? <img src={receiptUrl} alt={`Bukti pembayaran ${open.name}`} className="mx-auto max-h-96 rounded-lg object-contain" /> : <p className="text-center text-sm text-muted">Bukti tidak tersedia atau sedang dimuat.</p>}</div><div className="flex flex-col"><dl className="space-y-3 text-sm">{[["Mahasiswa", `${open.name} · ${open.nim}`], ["Program Studi", open.major], ["Tagihan sistem", rupiah(open.amount)]].map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b border-emerald-950/10 pb-2"><dt className="text-muted">{key}</dt><dd className="text-right font-semibold">{value}</dd></div>)}</dl>{rejecting && <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="Catatan penolakan" className={`${input} mt-4 resize-none`} />}<div className="mt-auto flex flex-wrap gap-3 pt-6">{rejecting ? <><Btn kind="outline" onClick={() => setRejecting(false)}>Batal</Btn><Btn kind="danger" className="flex-1" onClick={() => { onReject(open, note); close(); }}>Kirim Penolakan</Btn></> : <><Btn kind="danger" onClick={() => setRejecting(true)}><Icon d="x" className="size-4" />Tolak</Btn><Btn className="flex-1" onClick={() => { onApprove(open); close(); }}><Icon d="check" className="size-4" />Approve</Btn></>}</div></div></div></Modal>}
    </>
  );
}
