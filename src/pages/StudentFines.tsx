import { Fine, books } from "../data/portalData";
import { useState, useEffect, ReactNode } from "react";
import { Icon, Badge, Cover, Title, Stat, useCountdown, btnPrimary, btnSecondary, btnGhost, card, FINE_RATE, rupiah, Modal, UploadModal, QrisModal } from "./StudentShared";
import { StudentBook, Paper, papers } from "../data/portalData";
import { Icon as GlobalIcon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";

export function Fines() {
  const [fines, setFines] = useState<Fine[]>([
    { id: "F-0241", b: books[1], from: "10 Agu 2026", due: "24 Agu 2026", returned: "07 Sep 2026", late: 14, state: "unpaid" },
    { id: "F-0236", b: books[3], from: "28 Jul 2026", due: "11 Agu 2026", returned: "16 Agu 2026", late: 5, state: "rejected", file: "struk-dana-1608.jpg" },
    { id: "F-0219", b: books[5], from: "01 Jul 2026", due: "15 Jul 2026", returned: "18 Jul 2026", late: 3, state: "pending_verification", file: "bukti-qris-1807.png" },
  ]);
  const [showQrisModal, setShowQrisModal] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const find = (id: string | null) => fines.find((f) => f.id === id);
  const outstanding = fines.filter((f) => f.state !== "pending_verification").reduce((s, f) => s + f.late * FINE_RATE, 0);
  const pending = fines.filter((f) => f.state === "pending_verification").reduce((s, f) => s + f.late * FINE_RATE, 0);
    
  return (
    <div className="space-y-4">
      <div className={`${card} grid grid-cols-3 divide-x divide-emerald-950/5 p-5`}>
        {[[rupiah(outstanding), "Belum dibayar", "text-danger"], [rupiah(pending), "Menunggu verifikasi", "text-amber-700"], [`${rupiah(FINE_RATE)}/hari`, "Tarif denda", "text-ink"]].map(([v, l, c]) => (
          <div key={l} className="px-4 first:pl-0"><p className={`text-xl font-semibold tabular-nums md:text-2xl ${c}`}>{v}</p><p className="mt-0.5 text-xs text-muted">{l}</p></div>
        ))}
      </div>

      {fines.map((f) => (
        <div key={f.id} className={`${card} grid items-center gap-5 p-4 md:grid-cols-[80px_1fr_auto]`}>
          <div className="w-20"><Cover t="" c={f.b.c} small /></div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {f.state === "unpaid" && <Badge tone="red">Belum Dibayar</Badge>}
              {f.state === "pending_verification" && <Badge tone="amber">Menunggu Verifikasi Pustakawan</Badge>}
              {f.state === "rejected" && <Badge tone="red"><Icon d="alert" className="size-3.5" />Bukti Ditolak Pustakawan</Badge>}
              <span className="font-mono text-xs text-muted">{f.id}</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">{f.b.t}</p>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-muted">Dipinjam <b className="text-ink">{f.from}</b></span>
              <span className="text-muted">Jatuh tempo <b className="text-ink">{f.due}</b></span>
              <span className="text-muted">Terlambat <b className="text-danger">{f.late} hari</b></span>
            </div>
            {f.state === "rejected" && <p className="mt-2 text-xs text-danger">Gagal verifikasi: Struk tidak terbaca</p>}
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="md:text-right">
              <p className="text-xl font-semibold text-ink tabular-nums">{rupiah(f.late * FINE_RATE)}</p>
              <p className="text-xs text-muted">{rupiah(FINE_RATE)} × {f.late} hari</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {f.state === "unpaid" && (<>
                <button onClick={() => setShowQrisModal(f.id)} className={btnPrimary}>Bayar QRIS</button>
                <button onClick={() => setShowUploadModal(f.id)} className={btnGhost}><Icon d="upload" className="size-4" />Upload Bukti</button>
              </>)}
              {f.state === "pending_verification" && <button onClick={() => setViewing(f.id)} className={btnGhost}><Icon d="file" className="size-4" />Lihat Bukti Struk</button>}
              {f.state === "rejected" && (<>
                <button onClick={() => setShowQrisModal(f.id)} className={btnGhost}>Bayar QRIS</button>
                <button onClick={() => setShowUploadModal(f.id)} className={btnPrimary}><Icon d="upload" className="size-4" />Upload Ulang</button>
              </>)}
            </div>
          </div>
        </div>
      ))}

      {find(showQrisModal) && (
        <QrisModal fine={find(showQrisModal)!} onClose={() => setShowQrisModal(null)} onUpload={() => { setShowUploadModal(showQrisModal); setShowQrisModal(null); }} />
      )}
      {find(showUploadModal) && (
        <UploadModal
          fine={find(showUploadModal)!}
          onClose={() => setShowUploadModal(null)}
          onSubmit={(file) => { setFines((fs) => fs.map((x) => (x.id === showUploadModal ? { ...x, state: "pending_verification", file } : x))); setShowUploadModal(null); }}
        />
      )}
      {find(viewing) && (
        <Modal onClose={() => setViewing(null)}>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Bukti Struk · {viewing}</p>
          <h3 className="mt-1 text-lg font-semibold text-[#0d372b]">{find(viewing)!.file}</h3>
          <div className="mt-5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-5 font-mono text-xs text-slate-600">
            {[["Merchant", "UPT Perpustakaan PNL"], ["Nominal", rupiah(find(viewing)!.late * FINE_RATE)], ["Metode", "QRIS"], ["Status", "Menunggu verifikasi"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-dashed border-slate-200 py-2 last:border-0"><span className="text-slate-400">{k}</span><span>{v}</span></div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">Pustakawan biasanya memverifikasi dalam 1×24 jam kerja. Unggahan dikunci selama proses verifikasi.</p>
          <div className="mt-6 flex justify-end"><button onClick={() => setViewing(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Tutup</button></div>
        </Modal>
      )}
    </div>
  );
}
