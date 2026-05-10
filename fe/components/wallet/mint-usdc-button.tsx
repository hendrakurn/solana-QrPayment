"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SparklesIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function MintUsdcButton({ onSuccess }: { onSuccess?: () => void }) {
  const { publicKey, connected } = useWallet();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  if (!connected || !publicKey) return null;

  async function handleRequest() {
    if (!publicKey) return;
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: publicKey.toBase58() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Faucet request failed");

      setStatus("success");
      onSuccess?.();
      setTimeout(() => setStatus("idle"), 5_000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Faucet failed");
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
        setError(null);
      }, 6_000);
    }
  }

  const busy = status === "loading" || status === "success";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleRequest}
        disabled={busy}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 px-4 text-body font-semibold transition-colors cursor-pointer active:scale-[0.98]",
          status === "success"
            ? "border-success/40 bg-success/10 text-success"
            : status === "error"
              ? "border-danger/40 bg-danger/10 text-danger"
              : "bg-gradient-to-r from-accent-purple to-accent-yellow border-transparent text-white hover:brightness-110",
          busy && "opacity-70 cursor-not-allowed active:scale-100",
        )}
      >
        <SparklesIcon className="size-4" />
        {status === "loading"
          ? "Requesting USDC…"
          : status === "success"
            ? "10 USDC sent to your wallet!"
            : "Get 10 Free USDC"}
      </button>
      {error && (
        <p className="text-caption text-danger text-center px-1">{error}</p>
      )}
    </div>
  );
}
