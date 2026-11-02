import { Icon } from "./Icon";
import { Button } from "./Button";
import { Layout, RepoItem } from "../../types";

export function RepoCard({ item, layout, onDownload }: { item: RepoItem; layout: Layout; onDownload: (item: RepoItem) => void }) {
  const list = layout === "list";
  const dense = layout === "grid5" || layout === "grid6";
  return (
    <article className={`group flex rounded-2xl border border-emerald-950/10 bg-white transition hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-lg hover:shadow-emerald-950/10 ${dense ? "p-3" : "p-5"} ${list ? "flex-col gap-5 sm:flex-row sm:items-center" : "h-full flex-col"}`}>
      <div className={`flex shrink-0 items-center justify-center rounded-2xl bg-forest text-accent ${list ? "size-20" : dense ? "mb-3 size-10" : "mb-5 size-14"}`}>
        <Icon name="file" size={list ? "size-8" : dense ? "size-5" : "size-7"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.accent}`}>{item.type}</span>
          <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-bold text-muted">{item.department}</span>
        </div>
        <h3 className={`${dense ? "text-sm" : "text-lg"} font-extrabold leading-snug text-ink`}>{item.title}</h3>
        <div className={`${dense ? "mt-2 text-xs" : "mt-3 text-sm"} flex flex-wrap items-center gap-x-5 gap-y-2 text-muted`}>
          <span className="flex items-center gap-1.5"><Icon name="user" size="size-4" /> {item.author}</span>
          <span className="flex items-center gap-1.5 font-semibold"><Icon name="file" size="size-4" /> {item.size}</span>
        </div>
      </div>
      <Button onClick={() => onDownload(item)} variant="dark" className={`${list ? "w-full sm:w-auto" : dense ? "mt-4 w-full px-2 py-2 text-xs" : "mt-6 w-full"}`}>
        <Icon name="download" size="size-4" /> {dense ? "Download" : "Download PDF"}
      </Button>
    </article>
  );
}
