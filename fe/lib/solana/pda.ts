import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { SOLPAY_PROGRAM_ID, VAULT_SEED, PAYMENT_SEED } from "./config";

export function deriveVaultPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED], SOLPAY_PROGRAM_ID);
}

/**
 * Derives the PaymentRecord PDA for a given (vault, paymentCount). Seed format
 * matches contracts/programs/solpay/src/instructions/create_payment.rs:
 *   seeds = [b"payment", vault.key().as_ref(), &vault.payment_count.to_le_bytes()]
 */
export function derivePaymentPda(
  vault: PublicKey,
  paymentCount: BN | number | bigint,
): [PublicKey, number] {
  const count = BN.isBN(paymentCount)
    ? paymentCount
    : new BN(paymentCount.toString());
  return PublicKey.findProgramAddressSync(
    [PAYMENT_SEED, vault.toBuffer(), count.toArrayLike(Buffer, "le", 8)],
    SOLPAY_PROGRAM_ID,
  );
}
