import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-5 shadow-card backdrop-blur dark:border-[color:rgba(255,255,255,0.05)] dark:bg-[var(--surface)]/70 dark:shadow-cardDark",
        "before:pointer-events-none before:absolute before:inset-[-1px] before:bg-gradient-to-br before:from-brand/25 before:via-transparent before:to-accent/30",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
