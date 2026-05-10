"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Transaction } from "@/types";
import { fetchPaymentHistory } from "./history";

export interface PaymentHistoryState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  walletConnected: boolean;
  refetch: () => void;
}

/**
 * Reads the connected wallet's on-chain payment history straight from the
 * solpay program. Refetches:
 *   - whenever the wallet changes
 *   - when the window regains focus (user comes back from /pay/success)
 *
 * Source of truth: `PaymentRecord` accounts filtered by `payer`. No
 * localStorage, no indexer — the chain is the only history.
 */
export function usePaymentHistory(): PaymentHistoryState {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track latest fetch to ignore stale resolutions when wallet flips fast.
  const fetchIdRef = useRef(0);

  const fetchNow = useCallback(async () => {
    if (!publicKey) {
      setTransactions([]);
      setError(null);
      setLoading(false);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPaymentHistory(connection, publicKey);
      if (id !== fetchIdRef.current) return;
      setTransactions(list);
    } catch (e: unknown) {
      if (id !== fetchIdRef.current) return;
      setError(
        e instanceof Error ? e.message : "Failed to load transaction history",
      );
      setTransactions([]);
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    fetchNow();
  }, [fetchNow]);

  useEffect(() => {
    if (!publicKey) return;
    const onFocus = () => fetchNow();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [publicKey, fetchNow]);

  return {
    transactions,
    loading,
    error,
    walletConnected: connected && !!publicKey,
    refetch: fetchNow,
  };
}
