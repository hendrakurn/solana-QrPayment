import { NextRequest, NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  PublicKey,
  SendTransactionError,
} from "@solana/web3.js";
import {
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";

const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
const IDRX_MINT_ADDRESS =
  process.env.NEXT_PUBLIC_IDRX_MINT ?? "FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM";
const IDRX_DECIMALS = 2;
const FAUCET_AMOUNT = 50_000 * 10 ** IDRX_DECIMALS; // 50,000 IDRX = Rp 50.000

// In-memory rate limit: 1 request per wallet per minute
const lastRequest = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function loadFaucetKeypair(): Keypair {
  const raw = process.env.FAUCET_KEYPAIR_JSON;
  if (!raw) {
    throw new Error("FAUCET_KEYPAIR_JSON env var is not set");
  }
  let parsed: number[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      `FAUCET_KEYPAIR_JSON is not valid JSON (value starts with: ${raw.slice(0, 20)}...)`,
    );
  }
  if (!Array.isArray(parsed) || parsed.length !== 64) {
    throw new Error(
      `FAUCET_KEYPAIR_JSON must be a 64-byte array, got ${Array.isArray(parsed) ? parsed.length : typeof parsed} elements`,
    );
  }
  return Keypair.fromSecretKey(Uint8Array.from(parsed));
}

export async function POST(req: NextRequest) {
  const connection = new Connection(RPC, "confirmed");

  try {
    const body = await req.json();
    const wallet = body?.wallet;

    if (!wallet || typeof wallet !== "string") {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    let userPubkey: PublicKey;
    try {
      userPubkey = new PublicKey(wallet);
    } catch {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const now = Date.now();
    const last = lastRequest.get(wallet);
    if (last && now - last < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
      return NextResponse.json(
        { error: `Rate limited. Try again in ${wait}s.` },
        { status: 429 },
      );
    }

    let faucetKeypair: Keypair;
    try {
      faucetKeypair = loadFaucetKeypair();
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e);
      console.error("[faucet] keypair load failed:", reason);
      return NextResponse.json(
        { error: `Faucet not configured on this server: ${reason}` },
        { status: 503 },
      );
    }
    const idrxMint = new PublicKey(IDRX_MINT_ADDRESS);
    const mintInfo = await getMint(connection, idrxMint);

    if (!mintInfo.mintAuthority) {
      return NextResponse.json(
        { error: "IDRX mint has no mint authority. Faucet cannot mint new tokens." },
        { status: 409 },
      );
    }

    if (!mintInfo.mintAuthority.equals(faucetKeypair.publicKey)) {
      return NextResponse.json(
        {
          error:
            "FAUCET_KEYPAIR_JSON is not the mint authority for NEXT_PUBLIC_IDRX_MINT. Update the server keypair or mint config.",
        },
        { status: 409 },
      );
    }

    // Ensure user ATA exists (faucet pays rent if needed)
    const userAta = await getOrCreateAssociatedTokenAccount(
      connection,
      faucetKeypair,
      idrxMint,
      userPubkey,
    );

    const signature = await mintTo(
      connection,
      faucetKeypair,
      idrxMint,
      userAta.address,
      faucetKeypair,
      FAUCET_AMOUNT,
      [],
      { commitment: "confirmed" },
    );

    lastRequest.set(wallet, Date.now());

    return NextResponse.json({
      signature,
      amount: FAUCET_AMOUNT / 10 ** IDRX_DECIMALS,
    });
  } catch (e: unknown) {
    let message = e instanceof Error ? e.message : String(e);

    if (e instanceof SendTransactionError) {
      const logs = await e.getLogs(connection).catch(() => []);
      if (logs.some((line) => line.includes("owner does not match"))) {
        message =
          "FAUCET_KEYPAIR_JSON is not the mint authority for NEXT_PUBLIC_IDRX_MINT. Update the server keypair or mint config.";
      } else if (logs.some((line) => line.includes("insufficient funds"))) {
        message =
          "Faucet wallet does not have enough SOL to pay transaction fees or ATA creation.";
      } else if (logs.length) {
        message = `${message}\n${logs.join("\n")}`;
      }
    }

    console.error("[faucet]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
