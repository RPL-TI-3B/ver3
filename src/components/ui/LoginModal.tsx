import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { Brand } from "./Brand";
import { LoginRole, ModalSource } from "../../types";

export function LoginModal({ source, onClose, onLogin }: { source: ModalSource; onClose: () => void; onLogin: (role: LoginRole) => void }) {
  const actionTriggered = source !== "navbar";
  const [role, setRole] = useState<LoginRole>(actionTriggered ? "student" : "student");
  const [identity, setIdentity] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <Brand />
          <button type="button" onClick={onClose} aria-label="Tutup modal" className="flex size-9 items-center justify-center rounded-full bg-canvas text-muted transition hover:bg-slate-200 hover:text-ink"><Icon name="close" size="size-4" /></button>
        </div>
        <div className="p-6">
          <div className="mb-5">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-accent text-ink"><Icon name="lock" /></div>
            <h2 id="login-title" className="text-2xl font-black tracking-tight text-ink">Masuk dengan SSO PNL</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">Gunakan akun institusi Politeknik Negeri Lhokseumawe.</p>
          </div>
          {actionTriggered && (
            <div className="mb-5 flex gap-3 rounded-xl border border-accent/40 bg-accent-soft p-3.5 text-sm font-semibold leading-relaxed text-muted">
              <span className="mt-0.5 shrink-0 text-forest"><Icon name="info" size="size-5" /></span>
              {source === "download" ? "Login SSO PNL diperlukan untuk mengunduh berkas PDF mahasiswa." : "Fitur reservasi & download PDF khusus untuk Mahasiswa PNL."}
            </div>
          )}
          {!actionTriggered && (
            <div className="mb-5 grid grid-cols-2 rounded-xl bg-canvas p-1">
              <button type="button" onClick={() => setRole("student")} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition sm:text-sm ${role === "student" ? "bg-white text-ink shadow-sm" : "text-muted"}`}>Mahasiswa (NIM)</button>
              <button type="button" onClick={() => setRole("staff")} className={`rounded-lg px-3 py-2.5 text-xs font-bold transition sm:text-sm ${role === "staff" ? "bg-white text-ink shadow-sm" : "text-muted"}`}>Pustakawan / Staf (NIP)</button>
            </div>
          )}
          <form onSubmit={(event) => { event.preventDefault(); onLogin(role); }}>
            <label className="text-sm font-bold text-muted" htmlFor="identity">{role === "student" ? "Nomor Induk Mahasiswa (NIM)" : "Nomor Induk Pegawai (NIP)"}</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-3.5 text-slate-400"><Icon name="user" /></span>
              <input id="identity" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder={role === "student" ? "Masukkan NIM Anda" : "Masukkan NIP Anda"} className="h-12 w-full rounded-xl border border-emerald-950/10 pl-12 pr-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15" />
            </div>
            <Button type="submit" className="mt-4 w-full"><Icon name="shield" size="size-4" /> Lanjutkan dengan SSO PNL</Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" /> Mode simulasi <span className="h-px flex-1 bg-slate-200" /></div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={() => onLogin("student")}><Icon name="user" size="size-4" /> Simulasi Mahasiswa</Button>
            <Button variant="secondary" onClick={() => onLogin("staff")}><Icon name="building" size="size-4" /> Simulasi Pustakawan</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
