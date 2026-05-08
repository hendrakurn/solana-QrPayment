import { AnchorError } from "@coral-xyz/anchor";

/**
 * Map of program error codes to ID-locale user messages. Keys match
 * `#[error_code]` enum names in contracts/programs/solpay/src/error.rs.
 */
const ID_MESSAGES: Record<string, string> = {
  Unauthorized: "Tidak diizinkan: hanya admin vault yang boleh melakukan aksi ini.",
  PaymentAlreadyProcessed: "Pembayaran sudah pernah diproses sebelumnya.",
  PaymentNotPending: "Status pembayaran tidak pending.",
  InsufficientBalance: "Saldo USDC kamu tidak cukup.",
  InvalidAmount: "Nominal tidak valid (harus lebih dari nol).",
  InvalidMerchantId: "Merchant ID tidak valid.",
  ArithmeticOverflow: "Terjadi overflow aritmetika di program.",
};

/**
 * Convert any error thrown during a payment flow into a user-friendly
 * ID-locale message. Handles AnchorError, common wallet-adapter errors,
 * and RPC errors.
 */
export function parseSolpayError(err: unknown): string {
  if (err instanceof AnchorError) {
    const code = err.error?.errorCode?.code;
    return (
      ID_MESSAGES[code] ??
      err.error?.errorMessage ??
      "Program SolPay menolak transaksi."
    );
  }

  if (err instanceof Error) {
    const msg = err.message ?? "";
    if (/User rejected|Transaction was not confirmed|approve/i.test(msg)) {
      return "Transaksi dibatalkan di dompet Phantom.";
    }
    if (/Blockhash not found/i.test(msg)) {
      return "Jaringan padat — coba lagi sebentar lagi.";
    }
    if (/insufficient funds for rent/i.test(msg)) {
      return "SOL kamu tidak cukup untuk biaya transaksi.";
    }
    if (/Account does not exist/i.test(msg) && /vault/i.test(msg)) {
      return "Vault belum diinisialisasi di devnet.";
    }
    // Fallback: try to extract the AnchorError code from the message text
    // (sometimes the error is a plain Error wrapping the program log).
    const codeMatch = msg.match(/Error Code: (\w+)\./);
    if (codeMatch && ID_MESSAGES[codeMatch[1]]) {
      return ID_MESSAGES[codeMatch[1]];
    }
    return msg.length > 0 ? msg : "Pembayaran gagal.";
  }

  return typeof err === "string" ? err : "Pembayaran gagal.";
}
