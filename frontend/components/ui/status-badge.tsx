import { cn } from "@/lib/utils";

type BadgeProps = {
  status: "Locked" | "Released" | "Refunded";
};

export function StatusBadge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "Locked" && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
        status === "Released" && "bg-brand-soft text-[#0f1729] dark:bg-brand/25 dark:text-brand-foreground",
        status === "Refunded" && "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100"
      )}
    >
      {status}
    </span>
  );
}
