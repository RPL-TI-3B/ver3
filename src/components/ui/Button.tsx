import { type ReactNode } from "react";

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-accent text-ink hover:bg-accent-hover shadow-sm",
    secondary: "border border-emerald-950/10 bg-white text-muted hover:border-forest/20 hover:bg-canvas",
    ghost: "text-muted hover:bg-canvas hover:text-ink",
    dark: "bg-forest text-white hover:bg-forest-light",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-45 ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
