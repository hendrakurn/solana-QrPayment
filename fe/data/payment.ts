import type { PaymentDraft } from "@/types";

/**
 * The Pay screen normally hydrates from a real QRIS scan. Until that pipeline
 * is wired, this fixture drives the visual flow so we can iterate on the UI.
 */
export const mockPaymentDraft: PaymentDraft = {
  merchant: {
    name: "Kopi Kenangan",
    category: "Food & Drinks",
    city: "Jakarta",
    qrisId: "ID20232117283819",
    verified: true,
  },
  amountIdr: 42_500,
  recommendedWalletId: "w-usdc-main",
  rate: 15_640,
  feeIdr: 350,
};
