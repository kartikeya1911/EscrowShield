"use client";

import Link from "next/link";
import { Copy, LogOut, MoonStar, SunMedium, Wallet } from "lucide-react";
import { useWalletStore } from "@/store/wallet";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import toast from "react-hot-toast";

export function Navbar() {
  const { address, chainId, isCorrectNetwork, connectWallet, disconnectWallet, connecting, darkMode, toggleDarkMode } = useWalletStore();

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success("Wallet address copied");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)]/60 bg-[color:var(--background)]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-[var(--foreground)] shadow-lg">ES</span>
          <span>EscrowShield</span>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1 text-sm font-medium text-[var(--muted)] shadow-sm backdrop-blur md:flex">
          <Link href="/create" className="rounded-full px-3 py-2 transition hover:text-[var(--foreground)] hover:bg-[var(--surface-soft)]">
            Start Transaction
          </Link>
          <Link href="/dashboard" className="rounded-full px-3 py-2 transition hover:text-[var(--foreground)] hover:bg-[var(--surface-soft)]">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <SunMedium size={16} /> : <MoonStar size={16} />}
          </Button>
          {address ? (
            <>
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-3 py-2 text-xs shadow-sm backdrop-blur">
                <Wallet size={14} className={isCorrectNetwork ? "text-brand" : "text-accent"} />
                <span className="font-semibold text-[var(--foreground)]">{truncateAddress(address)}</span>
                <button onClick={copyAddress} className="text-[var(--muted)] transition hover:text-[var(--foreground)]" aria-label="Copy address">
                  <Copy size={14} />
                </button>
                <span className="hidden text-[var(--muted)] sm:inline">{chainId ? `Chain ${chainId}` : "No chain"}</span>
              </div>
              <Button variant="outline" onClick={disconnectWallet}>
                <LogOut size={14} />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={connectWallet} loading={connecting}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
