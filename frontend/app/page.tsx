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
  const demoVideoUrl = "https://drive.google.com/uc?export=download&id=1Rf_9PxBN0KFGVkvsB2bJx6THU4YRwVD3";
  const demoPreviewUrl = "https://drive.google.com/file/d/1Rf_9PxBN0KFGVkvsB2bJx6THU4YRwVD3/preview";

  return (
    <div className="space-y-14">
      <section className="grid gap-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-8 shadow-card backdrop-blur md:grid-cols-[1.2fr,1fr] md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[#0b6ea4] shadow-sm dark:bg-brand/10 dark:text-brand-foreground">
            <span className="h-2 w-2 rounded-full bg-brand" /> Live on-chain escrow
          </span>
          <h1 className="bg-gradient-to-r from-brand via-accent to-[#22d3ee] bg-clip-text font-heading text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Secure payments without trusting people you just met
          </h1>
          <p className="max-w-xl text-base text-[var(--muted)]">
            Lock funds in audited smart contracts, verify delivery, and release automatically on timeout. Designed for freelancers, vendors, and teams that need instant clarity.
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
          <div className="grid gap-3 sm:grid-cols-3">
            {["Disputes prevented", "Avg. release time", "Zero intermediaries"].map((label, idx) => (
              <Card key={label} className="bg-gradient-to-br from-[var(--surface)] via-[var(--surface-soft)] to-[var(--surface)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</p>
                <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{["95%", "24h", "100% on-chain"][idx]}</p>
              </Card>
            ))}
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

      <section className="grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
        <Card className="space-y-3">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">About EscrowShield</h2>
          <p className="text-sm text-[var(--muted)]">
            EscrowShield is a trustless payment layer for freelancers, vendors, and buyers. Funds lock into audited smart contracts, release on confirmation or timeout, and every action is fully transparent on-chain.
          </p>
          <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
            <div>
              <p className="font-semibold text-[var(--foreground)]">What you get</p>
              <ul className="mt-1 space-y-1">
                <li>• Smart-contract escrow with auto release</li>
                <li>• Refund path before timeout</li>
                <li>• Dashboard of all escrows</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">Networks</p>
              <p className="mt-1">Sepolia by default; localhost for dev.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={demoVideoUrl} target="_blank" rel="noreferrer" className="inline-flex">
              <Button>Watch Demo</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Open Dashboard</Button>
            </Link>
          </div>
        </Card>
        <Card className="space-y-3">
          <h3 className="font-heading text-xl font-semibold">Demo Preview</h3>
          <p className="text-sm text-[var(--muted)]">Watch the product walkthrough to see escrow creation, delivery confirmation, and auto release.</p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                src={demoPreviewUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
                title="EscrowShield Demo"
              />
            </div>
            <div className="mt-2 text-xs text-[var(--muted)]">
              If playback fails, <a className="font-semibold text-brand hover:underline" href={demoVideoUrl} target="_blank" rel="noreferrer">open the video</a> in a new tab.
            </div>
          </div>
        </Card>
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
          <h3 className="font-heading text-xl font-semibold">EscrowShield Advantage</h3>
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
