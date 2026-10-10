import { useState, useEffect, ReactNode } from "react";
import { Icon, Badge, Cover, Title, Stat, useCountdown, btnPrimary, btnSecondary, btnGhost, card, FINE_RATE, rupiah, Modal, UploadModal, QrisModal, Tabs } from "./StudentShared";
import { StudentBook, Paper, papers, CircTab, ErepoTab, Fine, books } from "../data/portalData";

import { Icon as GlobalIcon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Fines } from "./StudentFines";

export function Circulation() {
  const [tab, setTab] = useState<CircTab>("active");
  const [extended, setExtended] = useState<string[]>([]);
  const h1 = useCountdown(52), h2 = useCountdown(70);
  const active = [
    { b: books[0], from: "22 Sep 2026", due: "06 Okt 2026", days: 2 },
    { b: books[2], from: "29 Sep 2026", due: "13 Okt 2026", days: 9 },
  ];
  const hist = [
    ["Pemrograman Web Modern", "02 Agu 2026", "15 Agu 2026", "Tepat waktu"],
    ["Algoritma & Struktur Data", "10 Jun 2026", "26 Jun 2026", "Terlambat 2 hari · Lunas"],
    ["Basis Data Relasional", "03 Mei 2026", "16 Mei 2026", "Tepat waktu"],
    ["Mesin Konversi Energi", "12 Mar 2026", "24 Mar 2026", "Tepat waktu"],
  ];
  return (
    <>
      <Title eyebrow="Sirkulasi Buku" title="Peminjaman & reservasi" sub="Maks. 3 buku · durasi pinjam 14 hari · 1x perpanjangan" />
      <div className="mb-5"><Tabs value={tab} onChange={setTab} items={[["active", "Sedang Dipinjam"], ["hold", "Status Hold (3 Hari)"], ["history", "Riwayat Selesai"], ["fines", "Denda & Pembayaran"]]} /></div>

      {tab === "active" && (
        <div className="space-y-4">
          {active.map(({ b, from, due, days }) => {
            const ext = extended.includes(b.t);
            return (
              <div key={b.t} className={`${card} grid items-center gap-5 p-4 md:grid-cols-[80px_1fr_auto]`}>
                <div className="w-20"><Cover t="" c={b.c} small /></div>
                <div>
                  <p className="text-lg font-semibold text-ink">{b.t}</p>
                  <p className="text-sm text-muted">{b.a} · {b.k}</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <span className="text-muted">Dipinjam <b className="text-ink">{from}</b></span>
                    <span className="text-muted">Jatuh tempo <b className="text-ink">{ext ? "20 Okt 2026" : due}</b></span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Badge tone={ext ? "green" : days <= 3 ? "red" : "slate"}>{ext ? "Diperpanjang +14 hari" : `${days} hari lagi`}</Badge>
                  <button disabled={ext} onClick={() => setExtended([...extended, b.t])} className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-forest hover:bg-accent-hover disabled:bg-slate-100 disabled:text-slate-400">
                    {ext ? "Perpanjangan Diajukan" : "Ajukan Perpanjangan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "hold" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[{ b: books[7], t: h1, q: 1, rak: "B-04 / TIK" }, { b: books[6], t: h2, q: 2, rak: "B-07 / TIK" }].map(({ b, t, q, rak }) => (
            <div key={b.t} className={`${card} p-5`}>
              <div className="flex items-start justify-between gap-3">
                <div><Badge tone={q === 1 ? "lime" : "amber"}>{q === 1 ? "Siap diambil" : `Antrean #${q}`}</Badge><p className="mt-3 text-lg font-semibold text-ink">{b.t}</p><p className="text-sm text-muted">{b.a}</p></div>
              </div>
              <div className="mt-5 rounded-xl bg-forest p-4 text-white">
                <p className="text-xs uppercase tracking-wider text-white/60">Kedaluwarsa dalam</p>
                <p className="font-mono text-3xl font-bold text-accent">{t}</p>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted"><Icon d="pin" className="size-4 text-forest" />Rak ambil: <b className="text-ink">{rak}</b> · Lantai 2, Meja Sirkulasi</p>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-emerald-950/10 text-xs uppercase tracking-wider text-muted">
              <tr>{["Judul", "Dipinjam", "Dikembalikan", "Keterangan"].map((h) => <th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {hist.map((r) => (
                <tr key={r[0]} className="border-b border-emerald-950/5 last:border-0 hover:bg-canvas">
                  <td className="px-5 py-3.5 font-semibold text-ink">{r[0]}</td><td className="px-5 text-muted">{r[1]}</td><td className="px-5 text-muted">{r[2]}</td>
                  <td className="px-5"><Badge tone={r[3].startsWith("Tepat") ? "green" : "amber"}>{r[3]}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "fines" && <Fines />}
    </>
  );
}
