import { Icon } from "./Icon";
import { Layout, IconName } from "../../types";

export function LayoutSwitcher({ value, onChange }: { value: Layout; onChange: (layout: Layout) => void }) {
  const layouts: { id: Layout; icon: IconName; label: string }[] = [
    { id: "list", icon: "list", label: "Daftar" },
    { id: "grid4", icon: "grid4", label: "Grid 4" },
    { id: "grid5", icon: "grid5", label: "Grid 5" },
    { id: "grid6", icon: "grid6", label: "Grid 6" },
  ];
  return (
    <div className="flex rounded-xl border border-emerald-950/10 bg-canvas p-1" aria-label="Pilih tampilan">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          type="button"
          title={layout.label}
          aria-label={layout.label}
          onClick={() => onChange(layout.id)}
          className={`flex size-9 items-center justify-center rounded-lg transition ${value === layout.id ? "bg-forest text-accent shadow-sm" : "text-slate-400 hover:bg-white hover:text-forest"}`}
        >
          <Icon name={layout.icon} size="size-4" />
        </button>
      ))}
    </div>
  );
}
