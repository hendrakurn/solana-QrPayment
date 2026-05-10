import { AnchorProvider, BN, Program, type Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey, Transaction as Web3Tx } from "@solana/web3.js";
import type { Transaction, TransactionStatus } from "@/types";
import { SOLPAY_IDL } from "./idl";
import { USDC_DECIMALS } from "./config";

/**
 * On-chain payload Anchor returns when decoding a `PaymentRecord` account.
 * Casing is camelCased by Anchor (snake_case fields in the IDL → camelCase here).
 */
interface OnChainPaymentRecord {
  payer: PublicKey;
  vault: PublicKey;
  amountUsdc: BN;
  amountIdr: BN;
  merchantId: string;
  status: {
    pending?: object;
    confirmed?: object;
    refunded?: object;
    failed?: object;
  };
  xenditReference: string;
  createdAt: BN;
  updatedAt: BN;
  bump: number;
}

/**
 * Anchor account discriminator size in bytes. `PaymentRecord.payer` is the
 * first field, so its memcmp offset is exactly 8.
 */
const PAYER_OFFSET = 8;

/**
 * Builds a read-only `Program<Idl>` that can decode/fetch accounts without a
 * signing wallet. Anchor's provider still demands a "wallet" object — we hand
 * it a no-op stub because we never call `.rpc()` / `.transaction()` here.
 */
export function getReadonlySolpayProgram(connection: Connection): Program<Idl> {
  const stubWallet = {
    publicKey: PublicKey.default,
    signTransaction: async <T extends Web3Tx>(tx: T) => tx,
    signAllTransactions: async <T extends Web3Tx>(txs: T[]) => txs,
  };
  const provider = new AnchorProvider(
    connection,
    stubWallet as unknown as AnchorProvider["wallet"],
    { commitment: "confirmed" },
  );
  return new Program(SOLPAY_IDL, provider);
}

/**
 * Maps the on-chain `PaymentStatus` enum to the UI's three-state status.
 *
 * MVP rule: as soon as USDC has actually moved into the vault (i.e. the
 * `create_payment` tx confirmed), we treat the row as `success` in history,
 * even if the on-chain `status` is still `Pending`. The vault authority will
 * later flip it to `Confirmed` after IDR settlement — both map to success.
 *
 * `Refunded` and `Failed` both indicate the payment did not stick from the
 * payer's perspective, so we surface them as `failed` (red rail / strike-
 * through). The UI doesn't currently distinguish refund vs. failure.
 */
function mapStatus(status: OnChainPaymentRecord["status"]): TransactionStatus {
  if (status.failed !== undefined) return "failed";
  if (status.refunded !== undefined) return "failed";
  return "success";
}

/**
 * On-chain we only persist `merchant_id` (≤32 chars, typically the QRIS NMID).
 * We don't have a human-readable merchant name without an off-chain registry,
 * so for MVP we just surface the raw merchant_id and a generic category.
 */
function deriveMerchantLabel(merchantId: string): string {
  const trimmed = merchantId.trim();
  return trimmed.length > 0 ? trimmed : "Merchant";
}

const DEFAULT_CATEGORY = "QRIS Payment";

function toBN(value: BN | number | string | bigint): BN {
  return BN.isBN(value) ? value : new BN(value.toString());
}

export function mapPaymentRecord(
  pubkey: PublicKey,
  account: OnChainPaymentRecord,
): Transaction {
  const amountUsdcRaw = toBN(account.amountUsdc);
  const amountIdrRaw = toBN(account.amountIdr);
  const createdAtRaw = toBN(account.createdAt);

  const amountUsdc = amountUsdcRaw.toNumber() / 10 ** USDC_DECIMALS;
  const amountIdr = amountIdrRaw.toNumber();
  // `created_at` is a unix timestamp in seconds (i64).
  const occurredAt = new Date(createdAtRaw.toNumber() * 1000);
  const rate = amountUsdc > 0 ? amountIdr / amountUsdc : 0;

  return {
    id: pubkey.toBase58(),
    merchant: deriveMerchantLabel(account.merchantId),
    category: DEFAULT_CATEGORY,
    amountIdr,
    amountUsd: amountUsdc,
    walletId: account.payer.toBase58(),
    symbol: "USDC",
    status: mapStatus(account.status),
    occurredAt,
    reference: account.xenditReference || pubkey.toBase58().slice(0, 12),
    feeIdr: 0,
    rate,
  };
}

/**
 * Fetches every `PaymentRecord` whose `payer` matches the connected wallet,
 * decodes it, maps to the UI's `Transaction` shape, and returns newest-first.
 *
 * Uses a memcmp filter so the RPC returns just this user's records instead of
 * the entire account set — important once the vault has many payments.
 */
export async function fetchPaymentHistory(
  connection: Connection,
  payer: PublicKey,
): Promise<Transaction[]> {
  const program = getReadonlySolpayProgram(connection);

  // `Program<Idl>` doesn't statically know account names; same escape hatch
  // used in vault.ts for `program.account.vault.fetch`.
  const accounts = program.account as unknown as Record<
    string,
    {
      all: (
        filters?: { memcmp: { offset: number; bytes: string } }[],
      ) => Promise<{ publicKey: PublicKey; account: OnChainPaymentRecord }[]>;
    }
  >;

  const records = await accounts.paymentRecord.all([
    { memcmp: { offset: PAYER_OFFSET, bytes: payer.toBase58() } },
  ]);

  const txs = records.map((r) => mapPaymentRecord(r.publicKey, r.account));
  txs.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  return txs;
}
