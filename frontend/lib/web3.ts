import { BrowserProvider, Contract } from "ethers";
import { ESCROW_ABI } from "@/lib/generated/escrowAbi";
import { ESCROW_ADDRESS } from "@/lib/generated/escrowAddress";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function getInjectedProvider() {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return new BrowserProvider(window.ethereum);
}

async function assertEscrowContractDeployed(provider: BrowserProvider) {
  const code = await provider.getCode(ESCROW_ADDRESS);
  if (!code || code === "0x") {
    throw new Error("Escrow contract not deployed on this network. Run deploy:local again while Hardhat node is running.");
  }
}

export async function getEscrowContract(withSigner = false) {
  const provider = getInjectedProvider();
  if (!provider) throw new Error("MetaMask not found");

  await assertEscrowContractDeployed(provider);

  if (withSigner) {
    const signer = await provider.getSigner();
    return new Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);
  }

  return new Contract(ESCROW_ADDRESS, ESCROW_ABI, provider);
}
