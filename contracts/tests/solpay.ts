import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Solpay } from "../target/types/solpay";
import {
  createMint,
  mintTo,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
  getAccount,
} from "@solana/spl-token";
import { assert } from "chai";

describe("solpay", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solpay as Program<Solpay>;

  let idrxMint: anchor.web3.PublicKey;
  let vaultPda: anchor.web3.PublicKey;
  let vaultBump: number;
  let vaultTokenAccount: anchor.web3.PublicKey;
  let payerTokenAccount: anchor.web3.PublicKey;

  const authority = (provider.wallet as any).payer as anchor.web3.Keypair;

  before(async () => {
    idrxMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6
    );

    [vaultPda, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );

    payerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      authority,
      idrxMint,
      authority.publicKey
    );

    await mintTo(
      provider.connection,
      authority,
      idrxMint,
      authority.publicKey,
      100_000_000_000 // 100,000 USDC
    );

    vaultTokenAccount = await getAssociatedTokenAddress(
      idrxMint,
      vaultPda,
      true
    );
  });

  it("initializes vault", async () => {
    await program.methods
      .initializeVault()
      .accounts({
        authority: authority.publicKey,
        idrxMint,
      })
      .signers([authority])
      .rpc();

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.authority.toString(), authority.publicKey.toString());
    assert.equal(vault.idrxMint.toString(), idrxMint.toString());
    assert.equal(vault.totalReceived.toNumber(), 0);
    assert.equal(vault.totalSettled.toNumber(), 0);
    assert.equal(vault.totalRefunded.toNumber(), 0);
    assert.equal(vault.paymentCount.toNumber(), 0);
    assert.equal(vault.bump, vaultBump);
  });

  it("creates payment and transfers USDC to vault", async () => {
    const paymentCount = 0;
    const countBuffer = Buffer.alloc(8);
    countBuffer.writeBigUInt64LE(BigInt(paymentCount));
    const [paymentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), vaultPda.toBuffer(), countBuffer],
      program.programId
    );

    const amountIdrx = new BN(3_200_000); // 3.2 USDC
    const amountIdr = new BN(50_000);
    const merchantId = "MERCHANT001";
    const xenditRef = "xendit-ref-001";

    const payerBalanceBefore = (
      await getAccount(provider.connection, payerTokenAccount)
    ).amount;

    await program.methods
      .createPayment(amountIdrx, amountIdr, merchantId, xenditRef)
      .accounts({
        payer: authority.publicKey,
        idrxMint,
      })
      .signers([authority])
      .rpc();

    const payment = await program.account.paymentRecord.fetch(paymentPda);
    assert.equal(payment.amountIdrx.toNumber(), 3_200_000);
    assert.equal(payment.amountIdr.toNumber(), 50_000);
    assert.equal(payment.merchantId, merchantId);
    assert.equal(payment.xenditReference, xenditRef);
    assert.deepEqual(payment.status, { pending: {} });
    assert.equal(payment.payer.toString(), authority.publicKey.toString());
    assert.equal(payment.vault.toString(), vaultPda.toString());

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.totalReceived.toNumber(), 3_200_000);
    assert.equal(vault.paymentCount.toNumber(), 1);

    const payerBalanceAfter = (
      await getAccount(provider.connection, payerTokenAccount)
    ).amount;
    assert.equal(
      Number(payerBalanceBefore) - Number(payerBalanceAfter),
      3_200_000
    );
  });

  it("confirms payment (authority-only)", async () => {
    const countBuffer = Buffer.alloc(8);
    countBuffer.writeBigUInt64LE(BigInt(0));
    const [paymentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), vaultPda.toBuffer(), countBuffer],
      program.programId
    );

    await program.methods
      .confirmPayment()
      .accounts({
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const payment = await program.account.paymentRecord.fetch(paymentPda);
    assert.deepEqual(payment.status, { confirmed: {} });

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.totalSettled.toNumber(), 3_200_000);
  });

  it("rejects confirm on already-confirmed payment", async () => {
    const countBuffer = Buffer.alloc(8);
    countBuffer.writeBigUInt64LE(BigInt(0));
    const [paymentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), vaultPda.toBuffer(), countBuffer],
      program.programId
    );

    try {
      await program.methods
        .confirmPayment()
        .accounts({
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc();
      assert.fail("Should have thrown PaymentNotPending");
    } catch (err: any) {
      assert.include(err.toString(), "PaymentNotPending");
    }
  });

  it("refunds pending payment back to payer", async () => {
    // Create payment #2 to refund
    const paymentCount = 1;
    const countBuffer = Buffer.alloc(8);
    countBuffer.writeBigUInt64LE(BigInt(paymentCount));
    const [paymentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), vaultPda.toBuffer(), countBuffer],
      program.programId
    );

    const amountIdrx = new BN(1_000_000); // 1 USDC

    await program.methods
      .createPayment(
        amountIdrx,
        new BN(15_600),
        "MERCHANT002",
        "xendit-ref-002"
      )
      .accounts({
        payer: authority.publicKey,
        idrxMint,
      })
      .signers([authority])
      .rpc();

    const payerBalanceBefore = (
      await getAccount(provider.connection, payerTokenAccount)
    ).amount;

    await program.methods
      .refundPayment()
      .accounts({
        authority: authority.publicKey,
        payer: authority.publicKey,
        idrxMint,
      })
      .signers([authority])
      .rpc();

    const payment = await program.account.paymentRecord.fetch(paymentPda);
    assert.deepEqual(payment.status, { refunded: {} });

    const vault = await program.account.vault.fetch(vaultPda);
    assert.equal(vault.totalRefunded.toNumber(), 1_000_000);

    const payerBalanceAfter = (
      await getAccount(provider.connection, payerTokenAccount)
    ).amount;
    assert.equal(
      Number(payerBalanceAfter) - Number(payerBalanceBefore),
      1_000_000
    );
  });
});
