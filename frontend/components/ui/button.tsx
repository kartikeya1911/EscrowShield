import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "icon";
  loading?: boolean;
};

export function Button({ className, variant = "primary", size = "default", loading, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-brand px-4 py-2.5 text-brand-foreground shadow-[0_10px_30px_rgba(34,211,238,0.25)] hover:bg-[#12c8e1]",
        variant === "outline" && "border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] hover:border-brand hover:bg-[var(--surface-soft)]",
        variant === "ghost" && "px-3 py-2 text-[var(--foreground)] hover:bg-[var(--surface-soft)]",
        size === "icon" && "h-9 w-9 p-0",
        className
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
