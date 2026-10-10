import { useState, useEffect, ReactNode } from "react";
import { Icon, Badge, Cover, Title, Stat, useCountdown, btnPrimary, btnSecondary, btnGhost, card, FINE_RATE, rupiah, Modal, UploadModal, QrisModal, Tabs } from "./StudentShared";
import { StudentBook, Paper, papers, ErepoTab, books } from "../data/portalData";
import { Icon as GlobalIcon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";

export function ERepo() {
  const [tab, setTab] = useState<ErepoTab>("upload");
  const [file, setFile] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [cat, setCat] = useState("Non-Fiksi");
  const [sent, setSent] = useState(false);
  const input = "w-full rounded-lg border border-emerald-950/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-accent";
  const works = [
    { t: "Sistem Rekomendasi Buku Perpustakaan PNL Berbasis Collaborative Filtering", d: "Dr. Muhammad Arhami, M.Kom", date: "28 Sep 2026", s: "pending" },
    { t: "Implementasi Firewall Mikrotik pada Laboratorium Jaringan", d: "Hendrawaty, S.T., M.T.", date: "14 Jul 2026", s: "ok" },
    { t: "Analisis Usability Aplikasi SIAKAD Mahasiswa", d: "Azhar, S.T., M.Sc.", date: "02 Sep 2026", s: "rev" },
  ];
  const tone = { pending: ["amber", "Pending Kurasi"], ok: ["green", "Disetujui / Published"], rev: ["red", "Perlu Revisi"] } as const;

  return (
    <>
      <Title eyebrow="E-Repository & Karya" title="Arsipkan karya ilmiahmu" sub="Karya yang disetujui terbit di repositori terbuka PNL." />
      <div className="mb-5"><Tabs value={tab} onChange={setTab} items={[["upload", "Unggah Karya Baru"], ["my_works", "Karya Saya & Status Kurasi"], ["downloads", "Riwayat Unduhan"]]} /></div>

      {tab === "upload" && (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className={`${card} grid gap-6 p-6 lg:grid-cols-2`}>
          <div className="space-y-4">
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Judul Karya</span><input required className={input} placeholder="Contoh: Rancang Bangun Sistem..." /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Dosen Pembimbing</span><input required className={input} placeholder="Nama lengkap & gelar" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-semibold">Jurusan</span>
              <select className={input}><option>Teknologi Informasi dan Komputer</option><option>Teknik Mesin</option><option>Teknik Elektro</option><option>Teknik Sipil</option><option>Teknik Kimia</option><option>Tata Niaga</option></select>
            </label>
            <div><span className="mb-1.5 block text-sm font-semibold">Kategori</span>
              <div className="flex gap-2">{["Non-Fiksi", "Fiksi"].map((c) => (
                <button type="button" key={c} onClick={() => setCat(c)} className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold ${cat === c ? "border-forest bg-forest text-white" : "border-emerald-950/15 text-muted"}`}>{c}</button>
              ))}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="mb-1.5 block text-sm font-semibold">Berkas PDF</span>
            <label
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]?.name ?? null); }}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-forest bg-accent-soft" : "border-emerald-950/20 bg-canvas hover:border-forest-light"}`}
            >
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
              <div className="grid size-14 place-items-center rounded-full bg-accent text-forest"><Icon d="upload" className="size-6" /></div>
              {file ? <p className="mt-4 font-semibold text-forest">{file}</p> : <><p className="mt-4 font-semibold text-ink">Seret & lepas PDF di sini</p><p className="text-sm text-muted">atau klik untuk memilih · maks. 25 MB</p></>}
            </label>
            <button className="mt-4 rounded-lg bg-accent py-3 text-sm font-bold text-forest hover:bg-accent-hover">{sent ? "✓ Terkirim untuk Kurasi" : "Kirim untuk Kurasi"}</button>
          </div>
        </form>
      )}

      {tab === "my_works" && (
        <div className="grid gap-4 md:grid-cols-3">
          {works.map((w) => (
            <div key={w.t} className={`${card} flex flex-col p-5`}>
              <Badge tone={tone[w.s as keyof typeof tone][0]}>{tone[w.s as keyof typeof tone][1]}</Badge>
              <p className="mt-4 font-semibold leading-snug text-ink">{w.t}</p>
              <p className="mt-2 text-sm text-muted">Pembimbing: {w.d}</p>
              <p className="mt-auto pt-4 text-xs text-muted">Diunggah {w.date}</p>
              {w.s === "rev" && <p className="mt-3 rounded-lg bg-danger-soft p-3 text-xs text-danger">Catatan kurator: lengkapi lembar pengesahan & abstrak bahasa Inggris.</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "downloads" && (
        <div className={`${card} divide-y divide-emerald-950/5`}>
          {papers.slice(0, 5).map((p, i) => (
            <div key={p.t} className="flex items-center gap-4 p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-soft text-forest"><Icon d="file" className="size-5" /></div>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold text-ink">{p.t}</p><p className="text-xs text-muted">{p.a} · {p.j}</p></div>
              <span className="hidden text-xs text-muted sm:block">{["03 Okt", "01 Okt", "27 Sep", "20 Sep", "11 Sep"][i]} 2026</span>
              <button className="rounded-lg p-2 text-forest hover:bg-canvas" aria-label="Unduh ulang"><Icon d="download" className="size-4" /></button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
