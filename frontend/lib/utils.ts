import { clsx, type ClassValue } from "clsx";
import { formatEther } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEth(wei: bigint) {
  const ether = Number.parseFloat(formatEther(wei));
  return `${ether.toFixed(4)} ETH`;
}

export function formatDate(timestamp: bigint | number) {
  const ms = Number(timestamp) * 1000;
  return new Date(ms).toLocaleString();
}

export function statusFromId(status: bigint | number): "Locked" | "Released" | "Refunded" {
  const value = Number(status);
  if (value === 1) return "Released";
  if (value === 2) return "Refunded";
  return "Locked";
}
