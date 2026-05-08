import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from "@solana/spl-token";
import { USDC_MINT, USDC_DECIMALS } from "./config";

export interface UsdcBalance {
  ata: PublicKey;
  uiAmount: number;
  rawAmount: bigint;
  exists: boolean;
}

export async function getUsdcBalance(
  connection: Connection,
  owner: PublicKey,
): Promise<UsdcBalance> {
  const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
  try {
    const acc = await getAccount(connection, ata);
    return {
      ata,
      uiAmount: Number(acc.amount) / 10 ** USDC_DECIMALS,
      rawAmount: acc.amount,
      exists: true,
    };
  } catch (e) {
    if (
      e instanceof TokenAccountNotFoundError ||
      e instanceof TokenInvalidAccountOwnerError
    ) {
      return { ata, uiAmount: 0, rawAmount: BigInt(0), exists: false };
    }
    throw e;
  }
}
