import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { Brand } from "./Brand";
import { ModalSource } from "../../types";
import { supabase } from "../../lib/supabase";

export function LoginModal({ source, onClose }: { source: ModalSource; onClose: () => void }) {
  const actionTriggered = source !== "navbar";
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          <form onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            const normalizedIdentity = identity.replace(/\s+/g, "").toLowerCase();
            const email = `${normalizedIdentity}@siperpus.pnl.ac.id`;
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) setError("NIM/NIP atau password salah.");
            else onClose();
            setLoading(false);
          }}>
            <label className="text-sm font-bold text-muted" htmlFor="identity">NIM / NIP</label>
            <div className="relative mt-2">
              <span className="absolute left-4 top-3.5 text-slate-400"><Icon name="user" /></span>
              <input id="identity" required value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder="Masukkan NIM atau NIP" className="h-12 w-full rounded-xl border border-emerald-950/10 pl-12 pr-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15" />
            </div>
            <input id="password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="mt-3 h-12 w-full rounded-xl border border-emerald-950/10 px-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15" />
            {error && <p role="alert" className="mt-3 text-sm font-semibold text-danger">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-4 w-full"><Icon name="shield" size="size-4" /> {loading ? "Memproses..." : "Masuk"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
