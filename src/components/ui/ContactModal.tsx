import { useState } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-forest/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container: Diperkecil ke max-w-sm tanpa clutter */}
      <div className="flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-sm sm:rounded-2xl">
        {/* Clean Header: Langsung gabung Judul & Subtitle */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
              <Icon name="mail" size="size-4" />
            </div>
            <div>
              <h2 id="contact-title" className="text-sm font-bold text-ink">
                Hubungi Pustakawan
              </h2>
              <p className="text-[11px] text-muted">Tanyakan seputar buku & e-repository</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex size-7 items-center justify-center rounded-full bg-canvas text-muted transition hover:bg-slate-200 hover:text-ink"
          >
            <Icon name="close" size="size-4" />
          </button>
        </div>

        {/* Form Body langsung tanpa kotak email/telepon */}
        <div className="p-5">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-accent text-ink">
                <Icon name="check" size="size-6" />
              </div>
              <h3 className="text-base font-extrabold text-ink">Pesan Terkirim!</h3>
              <p className="mt-1 text-xs text-muted">
                Pustakawan akan membalas via email dalam 1x24 jam kerja.
              </p>
              <Button onClick={onClose} className="mt-5 h-9 w-full text-xs">
                Selesai
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="contact-name" className="text-xs font-bold text-muted">
                  Nama Lengkap
                </label>
                <input
                  id="contact-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Anda"
                  className="mt-1 h-9 w-full rounded-lg border border-emerald-950/10 px-3 text-xs font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="text-xs font-bold text-muted">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contoh@pnl.ac.id"
                  className="mt-1 h-9 w-full rounded-lg border border-emerald-950/10 px-3 text-xs font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-xs font-bold text-muted">
                  Topik Pertanyaan
                </label>
                <select
                  id="contact-subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 h-9 w-full rounded-lg border border-emerald-950/10 bg-white px-3 text-xs font-medium outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Pilih topik...</option>
                  <option value="sirkulasi">Sirkulasi & Peminjaman Buku</option>
                  <option value="erepo">E-Repository & Karya Ilmiah</option>
                  <option value="denda">Informasi Denda / Bebas Pustaka</option>
                  <option value="lainnya">Pertanyaan Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="text-xs font-bold text-muted">
                  Isi Pesan
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={2.5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail pertanyaan Anda..."
                  className="mt-1 w-full rounded-lg border border-emerald-950/10 p-2.5 text-xs font-medium outline-none placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <Button type="submit" className="mt-2 h-9 w-full text-xs">
                <Icon name="mail" size="size-3.5" /> Kirim Pesan
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
