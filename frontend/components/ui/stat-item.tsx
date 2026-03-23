import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatItemProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function StatItem({ label, value, className }: StatItemProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3", className)}>
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
