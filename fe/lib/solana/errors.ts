import { AnchorError } from "@coral-xyz/anchor";
import { SimulationError } from "./pay";

const MESSAGES: Record<string, string> = {
  Unauthorized: "Unauthorized: only the vault admin can perform this action.",
  PaymentAlreadyProcessed: "This payment has already been processed.",
  PaymentNotPending: "Payment status is not pending.",
  InsufficientBalance: "Insufficient IDRX balance.",
  InvalidAmount: "Invalid amount (must be greater than zero).",
  InvalidMerchantId: "Invalid merchant ID.",
  ArithmeticOverflow: "Arithmetic overflow in the program.",
};

function parseSimulationLogs(logs: string[]): string {
  for (const log of logs) {
    const codeMatch = log.match(/Error Code: (\w+)\./);
    if (codeMatch && MESSAGES[codeMatch[1]]) return MESSAGES[codeMatch[1]];

    if (/insufficient.*balance|Transfer: insufficient/i.test(log))
      return "Insufficient IDRX balance for this payment.";
    if (/insufficient.*lamports|insufficient funds for rent/i.test(log))
      return "Insufficient SOL to cover transaction fees.";
    if (/already in use/i.test(log))
      return "Payment record already exists — try again.";
    if (/account.*not.*initialized|does not exist/i.test(log))
      return "Vault not initialized or token account missing. Contact support.";
    if (/constraint.*violated|ConstraintAssociated/i.test(log))
      return "Token account mismatch. Contact support.";
  }
  return "Transaction simulation failed — check your balance and try again.";
}

export function parseSolpayError(err: unknown): string {
  if (err instanceof SimulationError) {
    return parseSimulationLogs(err.logs);
  }

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
      return "Transaction cancelled in wallet.";
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
