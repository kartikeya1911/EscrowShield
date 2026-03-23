"use client";

import { create } from "zustand";
import toast from "react-hot-toast";
import { LOCAL_CHAIN_ID } from "@/lib/constants";
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
      isCorrectNetwork: chainId === LOCAL_CHAIN_ID
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
        set({ chainId: updatedChain, isCorrectNetwork: updatedChain === LOCAL_CHAIN_ID });
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
      const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      set({
        address: accounts[0] ?? null,
        chainId,
        isCorrectNetwork: chainId === LOCAL_CHAIN_ID
      });

      if (chainId !== LOCAL_CHAIN_ID) {
        toast.error("Switch MetaMask to localhost network (31337)");
      } else {
        toast.success("Wallet connected");
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
