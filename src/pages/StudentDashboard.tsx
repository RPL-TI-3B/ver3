import { View } from "../data/portalData";
import { Icon, card, useCountdown, Stat, soft } from "./StudentShared";

export function StudentDashboard({ go }: { go: (v: View) => void }) {
  const hold = useCountdown(52);
  const [h, rest] = [hold.split(" ")[0], hold.split(" ")[1]];
  const genres = [["Jaringan", 42], ["Pemrograman", 31], ["Basis Data", 17], ["Lainnya", 10]] as const;
  return (
    <div className="space-y-6">
      {/* Top: greeting */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-slate-900 md:text-[34px]">Selamat datang kembali, <span className="font-semibold text-[#0d372b]">Ammar.</span></h1>
          <p className="mt-1 text-sm text-slate-500">NIM 2022573010041 · Teknik Informatika</p>
        </div>
      </header>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="books" label="Pinjaman Aktif" value="2" unit="/ 10" note="8 mendekati jatuh tempo" tone="green" />
        <Stat icon="clock" label="Hold Tertunda" value="1" note="Siap diambil di rak B-04" tone="green" />
        <Stat icon="layers" label="Buku Dibaca" value="14" unit="semester ini" note="+4 dibanding semester lalu" />
        <Stat icon="check" label="Ketepatan Waktu" value="96" unit="%" note="23 dari 24 tepat waktu" tone="green" />
      </div>

      {/* Middle row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${soft} p-7 lg:col-span-3`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Status Bebas Pustaka</p>
              <h2 className="mt-2 text-lg font-semibold text-[#0d372b]">Tidak ada tanggungan perpustakaan</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />Bebas Tanggungan
            </span>
          </div>
          <dl className="mt-7 grid grid-cols-3 divide-x divide-slate-100 border-y border-slate-100 py-5">
            {[["Rp 0", "Denda aktif"], ["0", "Tunggakan"], ["2", "Pinjaman aktif"]].map(([v, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dd className="text-2xl font-light text-slate-900 tabular-nums">{v}</dd>
                <dt className="mt-1 text-xs text-slate-500">{l}</dt>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">Surat keterangan bebas pustaka berlaku sebagai syarat pendaftaran yudisium. Pinjaman aktif harus dikembalikan sebelum surat diterbitkan.</p>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#0d372b]/15 bg-white px-4 py-2 text-sm font-medium text-[#0d372b] transition hover:bg-emerald-50/60">
              <Icon d="download" className="size-4" />Unduh Surat Yudisium
            </button>
          </div>
        </section>

        <section className={`${soft} flex flex-col p-7 lg:col-span-2`}>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full border border-amber-200 bg-amber-50/70 text-amber-600"><Icon d="alert" className="size-4" /></span>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Peringatan Jatuh Tempo</p>
          </div>
          <p className="mt-5 text-base font-medium leading-snug text-slate-900">Keamanan Jaringan Komputer</p>
          <p className="mt-1 text-sm text-slate-500">Kembalikan dalam <span className="font-medium text-amber-700">2 hari</span> · 06 Okt 2026</p>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-[11px] text-slate-400"><span>Masa pinjam</span><span className="tabular-nums">12 / 14 hari</span></div>
            <div className="h-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[86%] rounded-full bg-amber-400" /></div>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <p className="text-xs text-slate-400">Denda Rp 1.000/hari</p>
            <button onClick={() => go("circulation")} className="rounded-lg bg-[#0d372b] px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#155f46]">Perpanjang</button>
          </div>
        </section>
      </div>

      {/* Bottom: hold ticket */}
      <section className={`${soft} grid overflow-hidden md:grid-cols-[1fr_auto_260px]`}>
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0d372b]/10 bg-emerald-50/50 px-3 py-1 text-xs font-medium text-[#0d372b]">Reservasi Aktif · Hold 3 Hari</span>
            <span className="font-mono text-xs text-slate-400">PNL-HOLD-8921</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">Rekayasa Perangkat Lunak</h3>
          <p className="text-sm text-slate-500">Roger Pressman · 2020 · TIK 005.12</p>
          <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div><dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Lokasi Rak</dt><dd className="mt-1 flex items-center gap-1.5 text-lg font-medium text-[#0d372b]"><Icon d="pin" className="size-4 opacity-60" />B-04 / TIK</dd></div>
            <div><dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Pengambilan</dt><dd className="mt-1 text-sm text-slate-700">Meja Sirkulasi, Lt. 2</dd></div>
            <div><dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Bawa</dt><dd className="mt-1 text-sm text-slate-700">KTM aktif</dd></div>
          </dl>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-y-6 border-l border-dashed border-slate-200" />
          <span className="absolute -top-3 -left-3 size-6 rounded-full border border-slate-200/60 bg-slate-50" />
          <span className="absolute -bottom-3 -left-3 size-6 rounded-full border border-slate-200/60 bg-slate-50" />
        </div>
        <div className="flex flex-col justify-center border-t border-slate-100 p-7 md:border-t-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Sisa Waktu Hold</p>
          <p className="mt-2 font-mono text-3xl font-light tracking-tight text-[#0d372b] tabular-nums">{rest}</p>
          <p className="text-xs text-slate-500">+ {h.replace("h", "")} hari</p>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">Hold otomatis batal jika tidak diambil sebelum waktu habis.</p>
        </div>
      </section>

      {/* Reading analytics */}
      <section className={`${soft} p-7`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Analitik Peminjaman</p>
          <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">Genre favorit: <b className="ml-1 font-medium text-[#0d372b]">Jaringan</b></span>
        </div>
        <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
          {genres.map(([g, v], i) => <div key={g} style={{ width: `${v}%`, opacity: 1 - i * 0.25 }} className="h-full border-r-2 border-white bg-[#0d372b] last:border-0" />)}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {genres.map(([g, v], i) => (
            <span key={g} className="flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-sm bg-[#0d372b]" style={{ opacity: 1 - i * 0.25 }} />{g}<span className="tabular-nums text-slate-400">{v}%</span></span>
          ))}
        </div>
      </section>
    </div>
  );
}
