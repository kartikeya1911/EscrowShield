"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatItem } from "@/components/ui/stat-item";
import { StatusBadge } from "@/components/ui/status-badge";
import { autoReleaseTx, confirmDeliveryTx, fetchEscrow, requestRefundTx } from "@/lib/escrow";
import { formatDate, formatEth, truncateAddress } from "@/lib/utils";
import { getExplorerBase } from "@/lib/constants";
import { useWalletStore } from "@/store/wallet";
import { Escrow } from "@/types/escrow";

export default function VerifyPage() {
  const params = useParams<{ id: string }>();
  const escrowId = Number(params.id);
  const { address, chainId } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [actionHash, setActionHash] = useState<string | null>(null);

  const refresh = async () => {
    if (Number.isNaN(escrowId)) return;
    try {
      const result = await fetchEscrow(escrowId);
      setEscrow(result);
    } catch (error: any) {
      toast.error(error?.shortMessage ?? error?.message ?? "Unable to load escrow");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 12000);
    return () => clearInterval(timer);
  }, [params.id]);

  const isBuyer = useMemo(() => {
    if (!address || !escrow) return false;
    return address.toLowerCase() === escrow.buyer.toLowerCase();
  }, [address, escrow]);

  const runAction = async (fn: () => Promise<string>, message: string) => {
    setWorking(true);
    try {
      const hash = await fn();
      setActionHash(hash);
      toast.success(message);
      await refresh();
    } catch (error: any) {
      toast.error(error?.shortMessage ?? error?.message ?? "Transaction failed");
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <Card>
        <p className="text-sm">Escrow not found.</p>
      </Card>
    );
  }

  const explorer = getExplorerBase(chainId);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Escrow #{escrowId}</h1>
        <StatusBadge status={escrow.status} />
      </div>

      <Card className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <StatItem label="Buyer" value={truncateAddress(escrow.buyer, 6)} />
          <StatItem label="Seller" value={truncateAddress(escrow.seller, 6)} />
          <StatItem label="Amount" value={formatEth(escrow.amount)} />
          <StatItem label="Release Time" value={formatDate(escrow.releaseTime)} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Description</p>
          <p className="mt-1 text-sm">{escrow.description}</p>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="font-heading text-xl font-semibold">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={!isBuyer || escrow.status !== "Locked" || working}
            loading={working}
            onClick={() => runAction(() => confirmDeliveryTx(escrowId), "Delivery confirmed. Funds released")}
          >
            Confirm Delivery
          </Button>
          <Button
            variant="outline"
            disabled={!isBuyer || escrow.status !== "Locked" || working}
            onClick={() => runAction(() => requestRefundTx(escrowId), "Refund issued to buyer")}
          >
            Request Refund
          </Button>
          <Button
            variant="outline"
            disabled={escrow.status !== "Locked" || working}
            onClick={() => runAction(() => autoReleaseTx(escrowId), "Escrow auto-released")}
          >
            Trigger Auto Release
          </Button>
        </div>
        {!isBuyer ? <p className="text-xs text-[var(--muted)]">Only buyer can confirm delivery or request refund.</p> : null}
        {actionHash ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm">
            <p className="text-xs text-[var(--muted)]">Latest action tx hash:</p>
            <p className="break-all text-xs">{actionHash}</p>
            {explorer ? (
              <a href={`${explorer}${actionHash}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-brand hover:underline">
                Open Explorer <ExternalLink size={14} />
              </a>
            ) : null}
          </div>
        ) : null}
      </Card>

      <Link href="/dashboard" className="inline-flex text-sm font-medium text-brand hover:underline">
        Back to dashboard
      </Link>
    </motion.div>
  );
}
