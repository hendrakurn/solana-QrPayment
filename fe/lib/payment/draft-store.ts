"use client";

import { create } from "zustand";
import type { PaymentDraft } from "@/types";
import { mockPaymentDraft } from "@/data/payment";

interface DraftState {
  draft: PaymentDraft;
  setDraft: (d: PaymentDraft) => void;
  reset: () => void;
}

/**
 * Holds the current QRIS payment draft so /pay/scan can hand off to /pay/confirm.
 * For MVP the default is the mock draft (Kopi Kenangan) — once the real QRIS
 * decoder lands, /pay/scan will call setDraft({...parsed}) before navigating.
 */
export const usePaymentDraft = create<DraftState>((set) => ({
  draft: mockPaymentDraft,
  setDraft: (d) => set({ draft: d }),
  reset: () => set({ draft: mockPaymentDraft }),
}));
