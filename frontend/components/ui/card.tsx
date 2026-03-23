import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <div className={cn("rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-card dark:shadow-cardDark", className)}>{children}</div>;
}
