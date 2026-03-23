import { ethers } from "ethers";
import { getEscrowContract } from "@/lib/web3";
import { statusFromId } from "@/lib/utils";
import { Escrow } from "@/types/escrow";

type RawEscrow = {
  id: bigint;
  buyer: string;
  seller: string;
  amount: bigint;
  description: string;
  createdAt: bigint;
  releaseTime: bigint;
  status: bigint;
};

function toEscrow(raw: RawEscrow): Escrow {
  return {
    id: raw.id,
    buyer: raw.buyer,
    seller: raw.seller,
    amount: raw.amount,
    description: raw.description,
    createdAt: raw.createdAt,
    releaseTime: raw.releaseTime,
    status: statusFromId(raw.status)
  };
}

export async function createEscrowTx(seller: string, amountEth: string, description: string, timeoutSeconds: number) {
  const contract = await getEscrowContract(true);
  const tx = await contract.createEscrow(seller, description, timeoutSeconds, {
    value: ethers.parseEther(amountEth)
  });
  const receipt = await tx.wait();
  return { hash: tx.hash as string, receipt };
}

export async function fetchEscrow(id: number | bigint): Promise<Escrow> {
  const contract = await getEscrowContract();
  const raw = (await contract.getEscrow(id)) as RawEscrow;
  return toEscrow(raw);
}

export async function confirmDeliveryTx(id: number | bigint) {
  const contract = await getEscrowContract(true);
  const tx = await contract.confirmDelivery(id);
  await tx.wait();
  return tx.hash as string;
}

export async function requestRefundTx(id: number | bigint) {
  const contract = await getEscrowContract(true);
  const tx = await contract.requestRefund(id);
  await tx.wait();
  return tx.hash as string;
}

export async function autoReleaseTx(id: number | bigint) {
  const contract = await getEscrowContract(true);
  const tx = await contract.autoRelease(id);
  await tx.wait();
  return tx.hash as string;
}

export async function fetchUserEscrows(user: string): Promise<Escrow[]> {
  const contract = await getEscrowContract();
  const ids = (await contract.getUserEscrowIds(user)) as bigint[];
  const rows = await Promise.all(ids.map((id) => contract.getEscrow(id) as Promise<RawEscrow>));

  return rows
    .map(toEscrow)
    .sort((a, b) => Number(b.id) - Number(a.id));
}
