import { AnchorError } from "@coral-xyz/anchor";

const MESSAGES: Record<string, string> = {
  Unauthorized: "Unauthorized: only the vault admin can perform this action.",
  PaymentAlreadyProcessed: "This payment has already been processed.",
  PaymentNotPending: "Payment status is not pending.",
  InsufficientBalance: "Insufficient USDC balance.",
  InvalidAmount: "Invalid amount (must be greater than zero).",
  InvalidMerchantId: "Invalid merchant ID.",
  ArithmeticOverflow: "Arithmetic overflow in the program.",
};

export function parseSolpayError(err: unknown): string {
  if (err instanceof AnchorError) {
    const code = err.error?.errorCode?.code;
    return (
      MESSAGES[code] ??
      err.error?.errorMessage ??
      "SolPay program rejected the transaction."
    );
  }

  if (err instanceof Error) {
    const msg = err.message ?? "";
    if (/User rejected|Transaction was not confirmed|approve/i.test(msg)) {
      return "Transaction cancelled in Phantom wallet.";
    }
    if (/Blockhash not found/i.test(msg)) {
      return "Network congested — please try again shortly.";
    }
    if (/insufficient funds for rent/i.test(msg)) {
      return "Insufficient SOL to cover transaction fees.";
    }
    if (/Account does not exist/i.test(msg) && /vault/i.test(msg)) {
      return "Vault not yet initialized. Contact support.";
    }
    const codeMatch = msg.match(/Error Code: (\w+)\./);
    if (codeMatch && MESSAGES[codeMatch[1]]) {
      return MESSAGES[codeMatch[1]];
    }
    return msg.length > 0 ? msg : "Payment failed.";
  }

  return typeof err === "string" ? err : "Payment failed.";
}
