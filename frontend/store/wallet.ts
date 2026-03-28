"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import { TARGET_CHAIN_ID } from "@/lib/constants";
import { getInjectedProvider } from "@/lib/web3";

type WalletState = {
  address: string | null;
  chainId: number | null;
  connecting: boolean;
  isCorrectNetwork: boolean;
  darkMode: boolean;
  hydrate: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  toggleDarkMode: () => void;
};

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  chainId: null,
  connecting: false,
  isCorrectNetwork: false,
  darkMode: false,

  hydrate: async () => {
    if (typeof window === "undefined") return;

    const savedDarkMode = window.localStorage.getItem("dark-mode") === "true";
    document.documentElement.classList.toggle("dark", savedDarkMode);
    set({ darkMode: savedDarkMode });

    const provider = getInjectedProvider();
    if (!provider) return;

    const network = await provider.getNetwork();
    const accounts = (await provider.send("eth_accounts", [])) as string[];

    const current = accounts[0] ?? null;
    const chainId = Number(network.chainId);

    set({
      address: current,
      chainId,
      isCorrectNetwork: chainId === TARGET_CHAIN_ID
    });

    if (window.ethereum?.on) {
      window.ethereum.on("accountsChanged", (updatedAccounts: string[]) => {
        set({ address: updatedAccounts[0] ?? null });
      });

      window.ethereum.on("chainChanged", async () => {
        const refreshedProvider = getInjectedProvider();
        if (!refreshedProvider) return;
        const refreshedNetwork = await refreshedProvider.getNetwork();
        const updatedChain = Number(refreshedNetwork.chainId);
        set({ chainId: updatedChain, isCorrectNetwork: updatedChain === TARGET_CHAIN_ID });
      });
    }
  },

  connectWallet: async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      toast.error("MetaMask not detected");
      return;
    }

    set({ connecting: true });

    try {
      const chainIdHex = `0x${TARGET_CHAIN_ID.toString(16)}`;

      // Ask MetaMask to switch if on the wrong network.
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      if (currentChainId !== TARGET_CHAIN_ID) {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: chainIdHex }]);
        } catch (switchError: any) {
          toast.error(`Switch MetaMask to chain ${TARGET_CHAIN_ID}`);
        }
      }

      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      const refreshedNetwork = await provider.getNetwork();
      const chainId = Number(refreshedNetwork.chainId);
      set({
        address: accounts[0] ?? null,
        chainId,
        isCorrectNetwork: chainId === TARGET_CHAIN_ID
      });

      if (chainId === TARGET_CHAIN_ID) {
        toast.success("Wallet connected");
      } else {
        toast.error(`Switch MetaMask to chain ${TARGET_CHAIN_ID}`);
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to connect wallet");
    } finally {
      set({ connecting: false });
    }
  },

  disconnectWallet: () => {
    set({
      address: null,
      chainId: null,
      isCorrectNetwork: false,
      connecting: false
    });
    toast.success("Wallet disconnected from app");
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("dark-mode", String(next));
    set({ darkMode: next });
  }
}));
