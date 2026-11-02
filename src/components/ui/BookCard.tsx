import { Icon } from "./Icon";
import { Button } from "./Button";
import { BookCover } from "./BookCover";
import { Availability } from "./Availability";
import { ManageButton } from "./ManageButton";
import { Layout, Book } from "../../types";

export function BookCard({ book, layout, onReserve, onManage }: { book: Book; layout: Layout; onReserve: (book: Book) => void; onManage?: (book: Book) => void }) {
  if (layout === "list") {
    return (
      <article className="group flex flex-col gap-5 rounded-2xl border border-emerald-950/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-forest/20 hover:shadow-lg hover:shadow-emerald-950/10 sm:flex-row sm:items-center">
        <BookCover book={book} compact />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-forest">{book.shelf}</span>
            <Availability stock={book.stock} />
          </div>
          <h3 className="text-lg font-extrabold leading-snug text-ink">{book.title}</h3>
          <p className="mt-1 text-sm text-muted">{book.author}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted">
            <Icon name="books" size="size-4" /> Stok fisik: <strong className="text-ink">{book.stock} eksemplar</strong>
          </div>
        </div>
        {onManage ? <ManageButton onClick={() => onManage(book)} className="w-full sm:w-auto" /> : (
        <Button onClick={() => onReserve(book)} disabled={book.stock === 0} className="w-full sm:w-auto">
          <Icon name="calendar" size="size-4" /> Reservasi <span className="hidden lg:inline">(Hold 3 Hari)</span>
        </Button>
        )}
      </article>
    );
  }
  const dense = layout === "grid5" || layout === "grid6";
  return (
    <article className={`group flex h-full flex-col rounded-2xl border border-emerald-950/10 bg-white transition hover:-translate-y-1 hover:border-forest/25 hover:shadow-xl hover:shadow-emerald-950/10 ${dense ? "p-2.5" : "p-4"}`}>
      <BookCover book={book} dense={dense} />
      <div className={`flex flex-1 flex-col ${dense ? "pt-3" : "pt-5"}`}>
        <div className={`flex flex-wrap items-center ${dense ? "mb-2 gap-1" : "mb-3 gap-2"}`}>
          <span className={`rounded-full bg-accent-soft text-xs font-bold text-forest ${dense ? "px-2 py-0.5" : "px-2.5 py-1"}`}>{book.shelf}</span>
          <Availability stock={book.stock} />
        </div>
        <h3 className={`${dense ? "text-sm" : "text-base"} font-extrabold leading-snug text-ink`}>{book.title}</h3>
        <p className={`mt-1 text-muted ${dense ? "text-xs" : "text-sm"}`}>{book.author}</p>
        <div className={`${dense ? "mb-3 mt-3 pt-2" : "mb-4 mt-4 pt-3"} flex items-center gap-2 border-t border-slate-100 text-xs font-semibold text-muted`}>
          <Icon name="books" size="size-4" /> Stok: <strong className="text-ink">{book.stock} eksemplar</strong>
        </div>
        {onManage ? <ManageButton onClick={() => onManage(book)} className={`mt-auto w-full ${dense ? "px-2 py-2 text-xs" : ""}`} /> : (
        <Button onClick={() => onReserve(book)} disabled={book.stock === 0} className={`mt-auto w-full ${dense ? "px-2 py-2 text-xs" : ""}`}>
          <Icon name="calendar" size="size-4" /> {dense ? "Reservasi" : "Reservasi (Hold 3 Hari)"}
        </Button>
        )}
      </div>
    </article>
  );
}
