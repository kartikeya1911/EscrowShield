export type EscrowStatus = "Locked" | "Released" | "Refunded";

export type Escrow = {
  id: bigint;
  buyer: string;
  seller: string;
  amount: bigint;
  description: string;
  createdAt: bigint;
  releaseTime: bigint;
  status: EscrowStatus;
};
