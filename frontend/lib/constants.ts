export const TARGET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? 31337);

export function getExplorerBase(chainId?: number | null) {
  if (chainId === 11155111) return "https://sepolia.etherscan.io/tx/";
  if (chainId === 1) return "https://etherscan.io/tx/";
  return null;
}
