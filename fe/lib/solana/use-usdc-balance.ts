"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getUsdcBalance } from "./balances";
import { USDC_MINT } from "./config";

export interface UsdcBalanceState {
  uiAmount: number;
  exists: boolean;
  ata: PublicKey | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Live USDC balance for the currently-connected wallet. Refetches:
 *   - on wallet/connection change
 *   - when the window regains focus (user came back from Phantom popup)
 *   - via Solana account-change subscription on the ATA (websocket)
 */
export function useUsdcBalance(): UsdcBalanceState {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [uiAmount, setUiAmount] = useState(0);
  const [exists, setExists] = useState(false);
  const [ata, setAta] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track latest fetch to ignore stale resolutions
  const fetchIdRef = useRef(0);

  const fetchNow = useCallback(async () => {
    if (!publicKey) {
      setUiAmount(0);
      setExists(false);
      setAta(null);
      setError(null);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const b = await getUsdcBalance(connection, publicKey);
      if (id !== fetchIdRef.current) return; // stale
      setUiAmount(b.uiAmount);
      setExists(b.exists);
      setAta(b.ata);
    } catch (e: unknown) {
      if (id !== fetchIdRef.current) return;
      setError(e instanceof Error ? e.message : "Gagal memuat saldo");
      setUiAmount(0);
      setExists(false);
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, [connection, publicKey]);

  // Initial + dependency-change fetch
  useEffect(() => {
    fetchNow();
  }, [fetchNow]);

  // Refetch on window focus (user comes back from Phantom popup)
  useEffect(() => {
    if (!publicKey) return;
    const onFocus = () => fetchNow();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [publicKey, fetchNow]);

  // Subscribe to ATA account changes for live updates after payments
  useEffect(() => {
    if (!publicKey) return;
    let subId: number | null = null;
    let cancelled = false;

    (async () => {
      try {
        const ataAddr = await getAssociatedTokenAddress(USDC_MINT, publicKey);
        if (cancelled) return;
        subId = connection.onAccountChange(
          ataAddr,
          () => {
            // Trigger a fresh balance read; cheaper than parsing TokenAccount manually
            fetchNow();
          },
          { commitment: "confirmed" },
        );
      } catch {
        // Subscription is best-effort; the focus refetch is the safety net
      }
    })();

    return () => {
      cancelled = true;
      if (subId !== null) {
        connection.removeAccountChangeListener(subId).catch(() => {});
      }
    };
  }, [connection, publicKey, fetchNow]);

  return { uiAmount, exists, ata, loading, error, refetch: fetchNow };
}
