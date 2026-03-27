"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { fetchUserEscrows } from "@/lib/escrow";
import { formatDate, formatEth, truncateAddress } from "@/lib/utils";
import { Escrow } from "@/types/escrow";
import { useWalletStore } from "@/store/wallet";

type DashboardFilter = "Active" | "Completed" | "Refunded";
const filters: DashboardFilter[] = ["Active", "Completed", "Refunded"];

export default function DashboardPage() {
  const { address, connectWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [filter, setFilter] = useState<DashboardFilter>("Active");

  const load = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const rows = await fetchUserEscrows(address);
      setEscrows(rows);
    } catch (error: any) {
      toast.error(error?.shortMessage ?? error?.message ?? "Failed to fetch dashboard transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [address]);

  const filtered = useMemo(() => {
    if (filter === "Active") return escrows.filter((row) => row.status === "Locked");
    if (filter === "Completed") return escrows.filter((row) => row.status === "Released");
    return escrows.filter((row) => row.status === "Refunded");
  }, [escrows, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Transaction Dashboard</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">View and manage escrow transactions linked to your wallet.</p>
        </div>
        {address ? (
          <Button variant="outline" onClick={load} loading={loading}>
            Refresh
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              filter === option
                ? "bg-brand text-brand-foreground"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--muted)]">No transactions for this filter yet.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((row, index) => (
            <motion.div
              key={Number(row.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
            >
              <Card className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-heading text-lg font-semibold">Escrow #{Number(row.id)}</h2>
                  <StatusBadge status={row.status} />
                </div>
                <div className="grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2">
                  <p>Buyer: {truncateAddress(row.buyer, 6)}</p>
                  <p>Seller: {truncateAddress(row.seller, 6)}</p>
                  <p>Amount: {formatEth(row.amount)}</p>
                  <p>Release: {formatDate(row.releaseTime)}</p>
                </div>
                <p className="text-sm">{row.description}</p>
                <Link href={`/verify?id=${Number(row.id)}`} className="inline-flex text-sm font-medium text-brand hover:underline">
                  Open Verification Page
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

