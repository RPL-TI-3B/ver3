import { useState, useEffect, ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission, CircTab, CatalogTab, initialStudents, initialFines, initialSubs, fmtDate, rupiah } from "../data/librarianData";
import { Icon, Badge, Tabs, Btn, PageHead, Modal, Metric, SideLink, P, card, input, ROW, TIP, NavItem } from "./LibrarianShared";
import { Book } from "../types";


export function Fines({ fines, onApprove, onReject }: { fines: FineReq[]; onApprove: (f: FineReq) => void; onReject: (f: FineReq, note: string) => void }) {
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
