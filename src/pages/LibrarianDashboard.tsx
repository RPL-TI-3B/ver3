import { View } from "../data/librarianData";
import { Badge, Icon, Metric, PageHead, card } from "./LibrarianShared";

export function Dashboard({ go, loading, error, metrics }: { go: (view: View) => void; loading: boolean; error: string | null; metrics: { transactions: number; holds: number; fines: number; submissions: number } }) {
  const queue = [
    { label: "Verifikasi QRIS Pending", value: metrics.fines, view: "fines" as View },
    { label: "Antrean Kurasi E-Repo", value: metrics.submissions, view: "erepo_curation" as View },
  ];
  return <>
    <PageHead eyebrow={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} title="Dashboard Operasional" sub="Ringkasan layanan perpustakaan hari ini." />
    {error && <p role="alert" className="mb-4 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</p>}
    {loading ? <p className={`${card} p-10 text-center text-sm text-muted`}>Memuat metrik...</p> : <><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Transaksi Hari Ini" value={metrics.transactions} icon="repeat" note="Pinjam + kembali hari ini" onClick={() => go("sirkulasi")} /><Metric label="Antrean Hold Aktif" value={metrics.holds} icon="ticket" note="Tiket yang perlu dilayani" onClick={() => go("sirkulasi")} /><Metric label="Verifikasi QRIS Pending" value={metrics.fines} icon="receipt" note="Struk pembayaran denda" onClick={() => go("fines")} /><Metric label="Antrean Kurasi E-Repo" value={metrics.submissions} icon="fileCheck" note="Karya menunggu publikasi" onClick={() => go("erepo_curation")} /></div><section className={`${card} mt-6`}><div className="flex items-center justify-between border-b border-emerald-950/10 px-5 py-4"><h2 className="font-bold">Antrean Tindakan Cepat</h2><Badge tone="lime">{queue.reduce((sum, item) => sum + item.value, 0)} item</Badge></div>{queue.every((item) => item.value === 0) ? <p className="p-8 text-center text-sm text-muted">Semua antrean bersih.</p> : <ul className="divide-y divide-emerald-950/10">{queue.filter((item) => item.value > 0).map((item) => <li key={item.view} className="flex items-center gap-4 px-5 py-3.5"><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.label}</p><p className="text-xs text-muted">{item.value} item</p></div><button onClick={() => go(item.view)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest hover:bg-canvas">Proses</button></li>)}</ul>}</section></>}
  </>;
}
