import { Icon } from "./Icon";

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent text-ink shadow-sm">
        <Icon name="building" size="size-7" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-forest" />
      </div>
      <div>
        <div className="text-lg font-black leading-none tracking-tight text-ink">SIPERPUS-REPO</div>
        <div className="mt-1 text-xs font-medium text-muted">Politeknik Negeri Lhokseumawe</div>
      </div>
    </div>
  );
}
