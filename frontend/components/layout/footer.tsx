import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]/70 bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[var(--muted)] sm:flex-row sm:px-6 lg:px-8">
        <p className="text-[var(--foreground)]">Trustless escrow payments for modern teams.</p>
        <div className="flex items-center gap-4">
          <Link href="/create" className="rounded-full px-3 py-2 transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
            New Transaction
          </Link>
          <Link href="/dashboard" className="rounded-full px-3 py-2 transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
