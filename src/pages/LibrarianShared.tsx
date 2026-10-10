import { ReactNode } from "react";
import { View, Hold, Loan, Txn, Student, FineReq, Submission } from "../data/librarianData";
import { Book } from "../types";

export const P = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  userCheck: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 4 1.5M16 18l2 2 4-4",
  receipt: "M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21zM9 8h6M9 12h6M9 16h3",
  fileCheck: "M14 3H6v18h12V7zM14 3v4h4M9 14l2 2 4-4",
  books: "M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.5l3.8 1-3.9 15-3.8-1z",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 9-10",
  chevL: "M15 6l-6 6 6 6",
  chevR: "M9 6l6 6-6 6",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  ticket: "M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6H3zM14 6v12",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  alert: "M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  plus: "M12 5v14M5 12h14",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  pen: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
};
export const card = "rounded-2xl border border-emerald-950/10 bg-white";
export const input = "w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-accent/30";
export function Icon({ d, className = "size-5" }: { d: keyof typeof P; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={P[d]} />
    </svg>
  );
}

export function Badge({ tone, children }: { tone: "green" | "amber" | "red" | "slate" | "lime" | "blue"; children: ReactNode }) {
  const m = {
    green: "bg-success-soft text-success",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-danger-soft text-danger",
    slate: "bg-slate-100 text-muted",
    lime: "bg-accent-soft text-forest",
    blue: "bg-sky-50 text-sky-800",
  }[tone];
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${m}`}>{children}</span>;
}
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-emerald-950/10 bg-white p-1">
      {items.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${value === k ? "bg-forest text-white" : "text-muted hover:bg-canvas hover:text-ink"}`}>{l}</button>
      ))}
    </div>
  );
}

export function Btn({ kind = "primary", className = "", children, ...rest }: { kind?: "primary" | "outline" | "lime" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const k = {
    primary: "bg-forest text-white hover:bg-forest-light",
    lime: "bg-accent text-forest hover:bg-accent-hover",
    outline: "border border-emerald-950/15 bg-white text-ink hover:border-forest/30 hover:bg-canvas",
    danger: "border border-danger/25 bg-white text-danger hover:bg-danger-soft",
  }[kind];
  return <button {...rest} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-45 ${k} ${className}`}>{children}</button>;
}
export function PageHead({ eyebrow, title, sub, right }: { eyebrow: string; title: string; sub: string; right?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-forest-light">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>
      </div>
      {right}
    </header>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal className={`${card} max-h-[92vh] w-full overflow-y-auto p-6 shadow-2xl ${wide ? "max-w-3xl" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-canvas" aria-label="Tutup"><Icon d="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Metric({ label, value, icon, note, onClick }: { label: string; value: number; icon: keyof typeof P; note: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${card} group p-5 text-left transition hover:-translate-y-0.5 hover:border-forest/25`}>
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-forest"><Icon d={icon} /></span>
        <Icon d="arrowR" className="size-4 text-muted opacity-0 transition group-hover:opacity-100" />
      </div>
      <p className="mt-5 text-3xl font-extrabold tabular-nums tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
    </button>
  );
}

export function SideLink({ item, active, collapsed, onClick }: { item: NavItem; active: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={item.label} aria-current={active ? "page" : undefined}
      className={`${ROW} ${collapsed ? "lg:justify-center lg:px-0" : ""} ${active ? "bg-accent font-semibold text-forest" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
      <Icon d={item.icon} className="size-5 shrink-0" />
      <span className={`flex-1 truncate text-left ${collapsed ? "lg:hidden" : ""}`}>{item.label}</span>
      {!!item.count && <span className={`rounded-full px-2 text-[11px] font-bold tabular-nums ${active ? "bg-forest/10" : "bg-white/10"} ${collapsed ? "lg:absolute lg:right-1 lg:top-1 lg:px-1.5" : ""}`}>{item.count}</span>}
      {collapsed && <span role="tooltip" className={TIP}>{item.label}</span>}
    </button>
  );
}


export type NavItem = { key: View; label: string; icon: keyof typeof P; count?: number };
export const TIP = "pointer-events-none invisible absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 lg:block";
export const ROW = "group relative flex min-h-[42px] w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium tracking-[-0.01em] transition-[background-color,color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
