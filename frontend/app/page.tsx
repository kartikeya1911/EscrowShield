"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TimerReset, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Buyer Locks Payment",
    description: "Funds are sent to an escrow smart contract, never directly to the seller."
  },
  {
    title: "2. Seller Delivers",
    description: "Work or product is delivered while funds stay protected on-chain."
  },
  {
    title: "3. Buyer Confirms or Timeout",
    description: "Buyer confirms delivery, or timeout automatically releases funds to seller."
  }
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="grid gap-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-card md:grid-cols-[1.2fr,1fr] md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-200">
            Blockchain Payment Verification
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Secure Payments with Smart Contract Escrow
          </h1>
          <p className="max-w-xl text-base text-[var(--muted)]">
            Protect buyers from irreversible transfers while ensuring sellers get paid after verified delivery.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/create">
              <Button>
                Start Transaction
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Open Dashboard</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid gap-4"
        >
          <Card className="space-y-2">
            <ShieldCheck className="text-brand" />
            <h3 className="font-heading text-lg font-semibold">Trustless Protection</h3>
            <p className="text-sm text-[var(--muted)]">No intermediary controls your funds.</p>
          </Card>
          <Card className="space-y-2">
            <TimerReset className="text-accent" />
            <h3 className="font-heading text-lg font-semibold">Timeout Automation</h3>
            <p className="text-sm text-[var(--muted)]">Auto-release ensures clear transaction closure.</p>
          </Card>
          <Card className="space-y-2">
            <WalletCards className="text-brand" />
            <h3 className="font-heading text-lg font-semibold">On-Chain Transparency</h3>
            <p className="text-sm text-[var(--muted)]">Every state change is verifiable through wallet and tx hash.</p>
          </Card>
        </motion.div>
      </section>

      <section className="space-y-5">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full space-y-2">
                <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-[var(--muted)]">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          <h3 className="font-heading text-xl font-semibold">Traditional UPI Risk</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>Instant irreversible transfer</li>
            <li>No trust layer between buyer and seller</li>
            <li>Fraud recovery is manual and uncertain</li>
          </ul>
        </Card>
        <Card className="space-y-3">
          <h3 className="font-heading text-xl font-semibold">EscrowFlow Advantage</h3>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>Funds are locked in audited smart contract logic</li>
            <li>Release conditions are deterministic and transparent</li>
            <li>Dispute risk is reduced through on-chain rules</li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
