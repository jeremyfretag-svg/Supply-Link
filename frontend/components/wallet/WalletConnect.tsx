"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { getWalletAddress, FreighterNotInstalledError } from "@/lib/stellar/client";
import { useStore } from "@/lib/state/store";
import { FreighterNotInstalledModal } from "./FreighterNotInstalledModal";

export function WalletConnect() {
  const { walletAddress, setWalletAddress, disconnect } = useStore();
  const [loading, setLoading] = useState(false);
  const [showFreighterModal, setShowFreighterModal] = useState(false);

  async function connect() {
    setLoading(true);
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      if (error instanceof FreighterNotInstalledError) {
        setShowFreighterModal(true);
      } else {
        console.error("Failed to connect wallet:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    disconnect();
  }

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-green-600">
          {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="p-2 rounded hover:bg-[var(--muted-bg)] text-[var(--foreground)]"
          aria-label="Disconnect wallet"
          title="Disconnect wallet"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={connect}
        disabled={loading}
        className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-violet-700 transition"
      >
        {loading ? "Connecting…" : "Connect Freighter"}
      </button>
      <FreighterNotInstalledModal
        isOpen={showFreighterModal}
        onClose={() => setShowFreighterModal(false)}
      />
    </>
  );
}
