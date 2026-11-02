import { Icon } from "./Icon";
import { Book } from "../../types";

export function BookCover({ book, compact = false, dense = false }: { book: Book; compact?: boolean; dense?: boolean }) {
  if (book.cover.startsWith("http")) {
    return <img src={book.cover} alt={`Sampul ${book.title}`} className={`relative shrink-0 rounded-xl object-cover shadow-lg ${compact ? "h-32 w-24" : "aspect-[3/4] w-full"}`} />;
  }
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${book.cover || "from-forest to-forest-light"} text-white shadow-lg ${compact ? "h-32 w-24" : "aspect-[3/4] w-full"}`}>
      <div className="absolute inset-y-0 left-0 w-2 bg-white/10" />
      <div className={`flex h-full flex-col justify-between ${dense ? "p-2.5" : "p-4"}`}>
        <div className="text-xs font-black uppercase tracking-widest text-accent">PNL Library</div>
        <Icon name="book" size={compact ? "size-7" : dense ? "size-7" : "size-10"} />
        <div>
          <div className={`h-0.5 bg-accent ${dense ? "w-5" : "w-8"}`} />
          <div className={`${dense ? "mt-1" : "mt-2"} text-xs font-bold uppercase tracking-widest text-white/70`}>{book.code}</div>
        </div>
      </div>
    </div>
  );
}
