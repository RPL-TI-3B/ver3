import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Hero } from "../components/ui/Hero";
import { SelectField } from "../components/ui/SelectField";
import { LayoutSwitcher } from "../components/ui/LayoutSwitcher";
import { RepoCard } from "../components/ui/RepoCard";
import { Layout } from "../types";
import { useRepository } from "../lib/useSupabaseData";
import { RepoItem } from "../types";
import { fallbackDepartments } from "../lib/catalogTaxonomy";

export function RepositoryView({ onDownload }: { onDownload: (item: RepoItem) => void }) {
  const { repoItems, loading } = useRepository();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState<"all" | "nonfiction" | "fiction">("all");
  const [layout, setLayout] = useState<Layout>("grid4");

  // Filter logika pencarian, jurusan, dan kategori
  const filtered = repoItems.filter((item) => {
    const matchesQuery = `${item.title} ${item.author}`.toLowerCase().includes(query.toLowerCase());
    const matchesDepartment = !department || item.department === department;
    const matchesCategory = category === "all" || item.category === category;
    return matchesQuery && matchesDepartment && matchesCategory;
  });

  // Breakpoint Grid yang lebih responsif di zoom 100%
  const gridClass =
    layout === "grid4"
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      : layout === "grid5"
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : layout === "grid6"
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          : "grid-cols-1";

  return (
    <div>
      <Hero
        eyebrow="E-Repository PNL"
        title="Repositori Karya Ilmiah & Kreatif Mahasiswa"
        subtitle="Unggah dan akses karya digital mahasiswa Politeknik Negeri Lhokseumawe."
        icon="layers"
      />

      {/* SEARCH BAR & FILTER CONTROL SECTION */}
      <section className="relative z-10 mx-3 -mt-5 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-xl shadow-emerald-950/10 md:mx-6 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search Bar Utama (Memanjang / Flex-1) */}
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Cari karya digital</span>
            <span className="absolute left-4 top-3.5 text-slate-400">
              <Icon name="search" />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul paper, laporan magang, cerpen, atau penulis..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/15"
            />
          </label>

          {/* Filter Jurusan (Width Pas/Fixed) */}
          <SelectField
            value={department}
            onChange={setDepartment}
            label="Semua Jurusan"
            options={[
              ...new Set([
                ...fallbackDepartments,
                ...repoItems
                  .map((item) => item.department)
                  .filter((department) => department.trim().length > 0),
              ]),
            ]}
          />

          {/* Toggle Segmented Button Kategori (Semua / Non-Fiksi / Fiksi) */}
          <div className="flex shrink-0 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                category === "all" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setCategory("nonfiction")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                category === "nonfiction" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              Non-Fiksi
            </button>
            <button
              type="button"
              onClick={() => setCategory("fiction")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                category === "fiction" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
              }`}
            >
              Fiksi
            </button>
          </div>

          {/* Layout Switcher Grid/List */}
          <LayoutSwitcher value={layout} onChange={setLayout} />
        </div>
      </section>

      {/* RENDER HASIL E-REPOSITORY */}
      <section className="mt-9">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest">Arsip digital mahasiswa</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-ink">
              {loading ? "Memuat repositori..." : `${filtered.length} berkas ditemukan`}
            </h2>
          </div>
        </div>

        {filtered.length ? (
          <div className={`grid ${layout === "grid5" || layout === "grid6" ? "gap-3" : "gap-5"} ${gridClass}`}>
            {filtered.map((item) => (
              <RepoCard key={item.title} item={item} layout={layout} onDownload={onDownload} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon name="search" />
            </div>
            <h3 className="mt-4 font-bold text-slate-950">Berkas tidak ditemukan</h3>
            <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci atau filter kategori Anda.</p>
          </div>
        )}
      </section>
    </div>
  );
}
