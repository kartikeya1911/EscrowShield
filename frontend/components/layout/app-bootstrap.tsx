"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/store/wallet";

export function AppBootstrap() {
  const hydrate = useWalletStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
