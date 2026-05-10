"use client";

import { create } from "zustand";
import type { PaymentDraft, StablecoinSymbol } from "@/types";

export interface LastPayment {
  signature: string;
  paymentPda: string;
  draft: PaymentDraft;
  amountIdrx: number;
  symbol: StablecoinSymbol;
  timestamp: number;
}

interface LastPaymentState {
  last: LastPayment | null;
  set: (p: LastPayment) => void;
  clear: () => void;
}

/**
 * Bridge between /pay/confirm (writer) and /pay/success (reader). Cleared by
 * the success page so refreshing it after navigating elsewhere doesn't show
 * stale data.
 */
export const useLastPaymentStore = create<LastPaymentState>((set) => ({
  last: null,
  set: (p) => set({ last: p }),
  clear: () => set({ last: null }),
}));
