import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import { Hero } from "../components/ui/Hero";
import { SelectField } from "../components/ui/SelectField";
import { LayoutSwitcher } from "../components/ui/LayoutSwitcher";
import { BookCard } from "../components/ui/BookCard";
import { Layout, Book } from "../types";
import { useBooks } from "../lib/useSupabaseData";

export function BooksView({ onReserve, items: customItems, onManage }: { onReserve: (book: Book) => void; items?: Book[]; onManage?: (book: Book) => void }) {
  const { books: fetchedBooks, topics, departments, loading, error } = useBooks();
  const items = customItems || fetchedBooks;
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [theme, setTheme] = useState("");
  const [subtheme, setSubtheme] = useState("");
  const [layout, setLayout] = useState<Layout>("grid4");
  const filtered = items.filter((book) => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!department || book.department === department) && (!theme || book.mainTheme === theme) && (!subtheme || book.theme === subtheme);
  });
  const gridClass = layout === "grid4"
  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
  : layout === "grid5"
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    : layout === "grid6"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      : "grid-cols-1";

  return (
    <div>
      <Hero eyebrow="Katalog Perpustakaan" title="Akses Koleksi Buku Fisik Perpustakaan PNL" subtitle="Cari buku, cek lokasi rak fisik, dan reservasi mandiri." icon="books" />
      <section className="relative z-10 mx-3 -mt-5 rounded-2xl border border-emerald-950/10 bg-white p-4 shadow-xl shadow-emerald-950/10 md:mx-6 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
  <label className="relative min-w-0 flex-1">
    <span className="sr-only">Cari judul atau penulis</span>
    <span className="absolute left-4 top-3.5 text-slate-400">
      <Icon name="search" />
    </span>
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Cari judul buku atau nama penulis..."
      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
    />
  </label>

  <SelectField
    value={department}
    onChange={setDepartment}
    label="Semua Jurusan"
    options={departments.length ? departments : [...new Set(items.map((book) => book.department))]}
  />
  <SelectField
    value={theme}
    onChange={(value) => { setTheme(value); setSubtheme(""); }}
    label="Semua Tema Buku"
    options={[...new Set(topics.filter((topic) => !topic.parentId).map((topic) => topic.name))]}
  />
  <SelectField
    value={subtheme}
    onChange={setSubtheme}
    label="Semua Subtema"
    options={[...new Set(topics.filter((topic) => topic.parentId && (!theme || topic.parentName === theme)).map((topic) => topic.name))]}
  />
  <LayoutSwitcher value={layout} onChange={setLayout} />
</div>
      </section>
      <section className="mt-9">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest">Koleksi terbaru</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-ink">
              {loading ? "Memuat katalog..." : `${filtered.length} buku ditemukan`}
            </h2>
          </div>
        </div>
        {error ? (
          <div className="rounded-2xl border border-dashed border-red-300 bg-white py-16 text-center text-sm text-red-700">{error}</div>
        ) : filtered.length ? (
          <div className={`grid ${layout === "grid5" || layout === "grid6" ? "gap-3" : "gap-5"} ${gridClass}`}>{filtered.map((book) => <BookCard key={book.code} book={book} layout={layout} onReserve={onReserve} onManage={onManage} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-forest/20 bg-white py-16 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-canvas text-muted"><Icon name="search" /></div>
            <h3 className="mt-4 font-bold text-ink">Buku belum ditemukan</h3>
            <p className="mt-1 text-sm text-muted">Coba ubah kata kunci atau filter pencarian.</p>
          </div>
        )}
      </section>
    </div>
  );
}
