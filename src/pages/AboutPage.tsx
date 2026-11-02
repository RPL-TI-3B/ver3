import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { Hero } from "../components/ui/Hero";
import { IconName } from "../types";

export function AboutView({ onOpenContact }: { onOpenContact: () => void }) {
  const cards = [
    { icon: "building" as IconName, eyebrow: "Profil", title: "Perpustakaan PNL", content: "Pusat literasi dan pengetahuan yang mendukung pendidikan vokasi, penelitian terapan, dan inovasi seluruh sivitas akademika PNL.", tone: "bg-accent text-ink" },
    { icon: "clock" as IconName, eyebrow: "Jam Operasional", title: "Senin – Jumat", content: "08.00 – 16.00 WIB", detail: "Tutup pada Sabtu, Minggu, dan hari libur nasional.", tone: "bg-forest text-accent" },
    { icon: "map" as IconName, eyebrow: "Peta Rak Fisik", title: "Lantai 1", content: "Sirkulasi, TIK, dan Bisnis.", tone: "bg-accent-soft text-forest" },
    { icon: "phone" as IconName, eyebrow: "Kontak", title: "Hubungi Pustakawan", content: "perpustakaan@pnl.ac.id", detail: "(0645) 42785 · Kampus PNL, Buketrata", tone: "bg-forest-light text-white" },
  ];

  return (
    <div>
      <Hero eyebrow="Tentang Perpustakaan" title="Ruang belajar, bertumbuh, dan berkarya bersama." subtitle="Perpustakaan Politeknik Negeri Lhokseumawe hadir sebagai pusat sumber belajar terpadu bagi seluruh sivitas akademika." icon="building" />
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-emerald-950/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 md:p-7">
            <div className={`flex size-12 items-center justify-center rounded-xl ${card.tone}`}><Icon name={card.icon} size="size-6" /></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-forest">{card.eyebrow}</p>
            <h2 className="mt-1 text-2xl font-black text-ink">{card.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{card.content}</p>
            {card.detail && <p className="mt-3 text-sm font-semibold text-muted">{card.detail}</p>}
          </article>
        ))}
      </section>
      <section className="mt-5 flex flex-col gap-6 overflow-hidden rounded-2xl bg-accent p-7 md:flex-row md:items-center md:justify-between md:p-9">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-muted">Butuh bantuan pencarian?</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">Pustakawan kami siap membantu.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">Kunjungi meja layanan sirkulasi di lantai satu untuk bantuan koleksi, akses referensi, dan layanan repository.</p>
        </div>
        <Button onClick={onOpenContact} variant="dark" className="shrink-0">
          <Icon name="mail" size="size-4" /> Hubungi Pustakawan
        </Button>
      </section>
    </div>
  );
}
