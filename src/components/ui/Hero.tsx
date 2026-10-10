import { Icon } from "./Icon";
import { IconName } from "../../types";

export function Hero({ eyebrow, title, subtitle, icon }: { eyebrow: string; title: string; subtitle: string; icon: IconName }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-10 text-white shadow-xl shadow-forest/10 md:px-10 md:py-12">
      <div className="absolute -right-16 -top-24 size-72 rounded-full border border-accent/20 bg-accent/10" />
      <div className="absolute -bottom-24 right-32 size-48 rounded-full border border-white/10" />
      <div className="relative max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
          <Icon name={icon} size="size-4" />
          {eyebrow}
        </div>
        <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">{subtitle}</p>
      </div>
    </section>
  );
}
