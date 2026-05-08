export type StablecoinSymbol = "USDC" | "USDT" | "PYUSD" | "USDG";

export interface Wallet {
  id: string;
  symbol: StablecoinSymbol;
  network: "Solana" | "Solana Devnet";
  label: string;
  balance: number;
  fiatValue: number;
  apr?: number;
  trend24h: number;
  lastUsedAt: Date;
  useCount: number;
  isDefault?: boolean;
  address: string;
  /**
   * When true, the wallet is rendered as a disabled placeholder ("Segera hadir").
   * Used for stablecoins not yet supported by the on-chain program (USDT/PYUSD/USDG
   * — the SolPay vault currently only accepts USDC).
   */
  comingSoon?: boolean;
}

export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amountIdr: number;
  amountUsd: number;
  walletId: string;
  symbol: StablecoinSymbol;
  status: TransactionStatus;
  occurredAt: Date;
  reference: string;
  feeIdr: number;
  rate: number; // IDR per 1 stablecoin
}

export type WalletSort = "frequent" | "amount" | "recent";

export interface UserProfile {
  name: string;
  email: string;
  avatarSeed: string;
  country: string;
  timezone: string;
  defaultWalletId: string;
}

export interface MerchantInfo {
  name: string;
  category: string;
  city: string;
  qrisId: string;
  verified: boolean;
}

export interface PaymentDraft {
  merchant: MerchantInfo;
  amountIdr: number;
  recommendedWalletId: string;
  rate: number;
  feeIdr: number;
}
