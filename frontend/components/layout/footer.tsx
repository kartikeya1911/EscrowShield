import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-[var(--muted)] sm:flex-row sm:px-6 lg:px-8">
        <p>Trustless escrow payments for modern teams.</p>
        <div className="flex items-center gap-4">
          <Link href="/create" className="hover:text-[var(--foreground)]">
            New Transaction
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--foreground)]">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
