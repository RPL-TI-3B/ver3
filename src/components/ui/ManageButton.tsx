import { Icon } from "./Icon";
import { Button } from "./Button";

export function ManageButton({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <Button variant="secondary" onClick={onClick} className={className}>
      <Icon name="layers" size="size-4" /> Edit / Kelola
    </Button>
  );
}
