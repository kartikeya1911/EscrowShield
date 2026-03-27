"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWalletStore } from "@/store/wallet";
import { createEscrowTx } from "@/lib/escrow";
import { getExplorerBase } from "@/lib/constants";

export default function CreateTransactionPage() {
  const { address, connectWallet, chainId, isCorrectNetwork } = useWalletStore();
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [timeoutHours, setTimeoutHours] = useState("24");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!address) {
      toast.error("Connect wallet first");
      return;
    }

    if (!isCorrectNetwork) {
      toast.error("Switch to Hardhat localhost network (31337)");
      return;
    }

    if (!ethers.isAddress(seller)) {
      toast.error("Enter a valid seller wallet address");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount in ETH");
      return;
    }

    const timeout = Number(timeoutHours);
    if (!timeout || timeout <= 0) {
      toast.error("Timeout must be greater than zero");
      return;
    }

    setIsSubmitting(true);
    setTxHash(null);

    try {
      const result = await createEscrowTx(seller, amount, description.trim() || "No description", timeout * 3600);
      setTxHash(result.hash);
      toast.success("Escrow locked successfully");
      setSeller("");
      setAmount("");
      setDescription("");
    } catch (error: any) {
      toast.error(error?.shortMessage ?? error?.message ?? "Escrow creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const explorer = getExplorerBase(chainId);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="space-y-5">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">Create Escrow Transaction</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Lock payment funds in smart contract until delivery is confirmed.</p>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input label="Seller Wallet Address" value={seller} onChange={(e) => setSeller(e.target.value)} placeholder="0x..." required />
            <Input label="Amount (ETH)" type="number" step="0.0001" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Website development milestone" />
            <Input label="Escrow Timeout (hours)" type="number" min="1" value={timeoutHours} onChange={(e) => setTimeoutHours(e.target.value)} required />
            <div className="flex flex-wrap gap-3">
              {address ? (
                <Button type="submit" loading={isSubmitting}>
                  Lock Payment
                </Button>
              ) : (
                <Button type="button" onClick={connectWallet}>
                  Connect Wallet
                </Button>
              )}
              <Link href="/dashboard">
                <Button type="button" variant="outline">View Dashboard</Button>
              </Link>
            </div>
          </form>
        </Card>
      </motion.section>

      <motion.aside initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }} className="space-y-4">
        <Card className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">Transaction Status</h2>
          <p className="text-sm text-[var(--muted)]">
            {isSubmitting
              ? "Sending transaction to blockchain..."
              : txHash
              ? "Payment is locked in escrow. Share escrow ID from dashboard with counterparty."
              : "Fill the form to initiate a protected transaction."}
          </p>
          {txHash ? (
            <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-sm">
              <p className="font-medium">Transaction Hash</p>
              <p className="break-all text-xs text-[var(--muted)]">{txHash}</p>
              {explorer ? (
                <a
                  href={`${explorer}${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  Open Explorer
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-[var(--muted)]">Explorer link unavailable for local chain.</p>
              )}
            </div>
          ) : null}
        </Card>

        <Card className="space-y-2">
          <h3 className="font-heading text-lg font-semibold">Network Check</h3>
          <p className="text-sm text-[var(--muted)]">
            Connected chain: {chainId ?? "Not connected"} {isCorrectNetwork ? "(Ready)" : "(Switch to 31337)"}
          </p>
        </Card>
      </motion.aside>
    </div>
  );
}
