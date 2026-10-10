import { QrisMock } from "./QrisMock";
import { useState, useEffect, ReactNode } from "react";
import { Icon as GlobalIcon } from "../components/ui/Icon";
import { StudentBook, Paper, View, Fine } from "../data/portalData";

export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:bg-accent-hover";
export const btnSecondary = "inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-950/10 bg-white px-4 py-2 text-sm font-bold text-muted transition hover:border-forest/20 hover:bg-canvas hover:text-ink";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-muted transition hover:bg-slate-100 hover:text-ink";
export const card = "rounded-2xl border border-emerald-950/10 bg-white";
export const FINE_RATE = 1000;
export const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// Local Icon for StudentPortal
export const P = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  books: "M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.8 1-3.9 15-3.8-1z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  file: "M14 3H6v18h12V7zM14 3v4h4M12 17v-6M9 14l3-3 3 3",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 9-10",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  upload: "M12 20V8M7 13l5-5 5 5M4 4h16",
  layers: "M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5",
  panel: "M3 4h18v16H3zM9 4v16",
  chevL: "M15 6l-6 6 6 6",
  chevR: "M9 6l6 6-6 6",
  pin: "M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};
export function Icon({ d, className = "size-5" }: { d: keyof typeof P; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={P[d]} />
    </svg>
  );
}

export function Badge({ tone, children }: { tone: "green" | "amber" | "red" | "slate" | "lime"; children: ReactNode }) {
  const m = {
    green: "bg-success-soft text-success",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-danger-soft text-danger",
    slate: "bg-slate-100 text-muted",
    lime: "bg-accent-soft text-forest",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${m}`}>{children}</span>;
}
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-emerald-950/10 bg-white p-1">
      {items.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${value === k ? "bg-forest text-white" : "text-muted hover:bg-canvas hover:text-ink"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Cover({ t, c, small }: { t: string; c: string; small?: boolean }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-lg p-3 text-white" style={{ background: c }}>
      <div className="absolute inset-y-0 left-2 w-px bg-white/20" />
      <p className={`font-semibold leading-tight ${small ? "text-[11px]" : "text-sm"}`}>{t}</p>
      <div className="absolute bottom-3 left-3 h-1 w-8 rounded bg-accent" />
    </div>
  );
}

export function Title({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-light">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export function Stat({ icon, label, value, unit, note, tone = "slate" }: { icon: keyof typeof P; label: string; value: string; unit?: string; note: string; tone?: "slate" | "green" | "amber" }) {
  const dot = { slate: "bg-slate-300", green: "bg-emerald-500", amber: "bg-amber-400" }[tone];
  return (
    <div className={`${soft} p-6 transition hover:border-slate-300/70`}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <span className="text-[#0d372b]/50"><Icon d={icon} className="size-4" /></span>
      </div>
      <p className="mt-5 text-3xl font-light tracking-tight text-[#0d372b] tabular-nums">
        {value}{unit && <span className="ml-1 text-base font-normal text-slate-400">{unit}</span>}
      </p>
      <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><span className={`size-1.5 rounded-full ${dot}`} />{note}</p>
    </div>
  );
}

export function useCountdown(hours: number) {
  const [end] = useState(() => Date.now() + hours * 3600_000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(s / 86400)}h ${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/* ---------- Views ---------- */
export const soft = "rounded-2xl border border-slate-200/60 bg-white";



export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-white p-7 shadow-2xl shadow-slate-900/10" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Tutup" className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Icon d="x" className="size-4" /></button>
        {children}
      </div>
    </div>
  );
}

export function UploadModal({ fine, onClose, onSubmit }: { fine: Fine; onClose: () => void; onSubmit: (file: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const pick = (f?: File) => {
    if (!f) return;
    if (!/^image\/|application\/pdf/.test(f.type)) return setErr("Format harus JPG, PNG, atau PDF.");
    if (f.size > 5 * 1024 * 1024) return setErr("Ukuran file melebihi 5 MB.");
    setErr(""); setFile(f);
  };
  return (
    <Modal onClose={onClose}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{fine.state === "rejected" ? "Unggah Ulang" : "Konfirmasi Pembayaran"}</p>
      <h3 className="mt-1 text-lg font-semibold text-[#0d372b]">Unggah bukti transfer</h3>
      <p className="mt-1 truncate text-sm text-slate-500">{fine.b.t} · {rupiah(fine.late * FINE_RATE)}</p>
      <form onSubmit={(e) => { e.preventDefault(); if (file) onSubmit(file.name); }}>
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          className={`mt-5 flex cursor-pointer flex-col items-center rounded-xl border border-dashed px-6 py-9 text-center transition ${drag ? "border-[#0d372b]/40 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"}`}
        >
          <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          <span className="grid size-10 place-items-center rounded-full border border-slate-200 text-[#0d372b]/70"><Icon d="upload" className="size-4" /></span>
          {file ? (
            <><p className="mt-3 max-w-full truncate text-sm font-medium text-slate-900">{file.name}</p><p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB · klik untuk ganti</p></>
          ) : (
            <><p className="mt-3 text-sm font-medium text-slate-700">Tarik struk ke sini atau <span className="text-[#0d372b] underline underline-offset-2">pilih file</span></p><p className="mt-1 text-xs text-slate-400">JPG, PNG, atau PDF · maks. 5 MB</p></>
          )}
        </label>
        {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Batal</button>
          <button type="submit" disabled={!file} className="rounded-lg bg-[#0d372b] px-4 py-2 text-sm font-medium text-white hover:bg-[#155f46] disabled:bg-slate-100 disabled:text-slate-400">Kirim untuk Verifikasi</button>
        </div>
      </form>
    </Modal>
  );
}

export function QrisModal({ fine, onClose, onUpload }: { fine: Fine; onClose: () => void; onUpload: () => void }) {
  return (
    <Modal onClose={onClose}>
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
          <p className="text-2xl font-semibold text-[#0d372b] tabular-nums">{rupiah(fine.late * FINE_RATE)}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">Scan menggunakan M-Banking / GoPay / OVO / Dana, lalu simpan bukti struk dan unggah pada tombol <b className="font-medium text-slate-700">Unggah Bukti</b>.</p>
      <p className="mt-2 truncate text-xs text-slate-400">Denda: {fine.b.t} · {fine.late} hari</p>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Tutup</button>
        <button onClick={onUpload} className="inline-flex items-center gap-2 rounded-lg bg-[#0d372b] px-4 py-2 text-sm font-medium text-white hover:bg-[#155f46]"><Icon d="upload" className="size-4" />Lanjut Unggah Bukti</button>
      </div>
    </Modal>
  );
}
