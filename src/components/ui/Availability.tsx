import { Icon } from "./Icon";
import { Button } from "./Button";

export function Availability({ stock }: { stock: number }) {
  return stock > 0 ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
      <span className="size-1.5 rounded-full bg-success" /> Tersedia
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-bold text-danger">
      <span className="size-1.5 rounded-full bg-danger" /> Dipinjam
    </span>
  );
}

export function ManageButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <Button variant="secondary" onClick={onClick} className={className}>
      <Icon name="layers" size="size-4" /> Edit / Kelola
    </Button>
  );
}
