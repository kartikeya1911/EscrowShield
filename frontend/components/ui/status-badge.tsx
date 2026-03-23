import { cn } from "@/lib/utils";

type BadgeProps = {
  status: "Locked" | "Released" | "Refunded";
};

export function StatusBadge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "Locked" && "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200",
        status === "Released" && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
        status === "Refunded" && "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100"
      )}
    >
      {status}
    </span>
  );
}
