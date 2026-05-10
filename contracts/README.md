# SolPay Smart Contract

Anchor program on Solana. Records IDRX payments from users to a vault PDA, enabling Indonesian merchant payments via Xendit/GoPay.

## Important Addresses (Devnet)

| Name | Address | Explorer |
|------|---------|---------|
| Program | `35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ` | [↗](https://explorer.solana.com/address/35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ?cluster=devnet) |
| IDRX Mint | `FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM` | [↗](https://explorer.solana.com/address/FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM?cluster=devnet) |
| Vault PDA | `92DtDU3efr54phKtxCtXKuv6WnkAV2mpvTgSaybK2JnP` | [↗](https://explorer.solana.com/address/92DtDU3efr54phKtxCtXKuv6WnkAV2mpvTgSaybK2JnP?cluster=devnet) |
| Vault Token Account | `DA3xxP5eM4bo1p7KwYRvSLJs3Mv4XmiQEFEAf5VZS72f` | [↗](https://explorer.solana.com/address/DA3xxP5eM4bo1p7KwYRvSLJs3Mv4XmiQEFEAf5VZS72f?cluster=devnet) |
| Authority Wallet | `9Nxj6oHYk7VkqKTDL9DZX2y4R6zgE4sTjMR9b29mJ9RY` | [↗](https://explorer.solana.com/address/9Nxj6oHYk7VkqKTDL9DZX2y4R6zgE4sTjMR9b29mJ9RY?cluster=devnet) |

> Vault PDA seeds: `["vault"]` — Authority wallet is the only signer allowed to call `confirm_payment` and `refund_payment`.

## Instructions

| Instruction | Signer | Description |
|-------------|--------|-------------|
| `initialize_vault` | authority | Create vault PDA + IDRX token account |
| `create_payment` | payer | Transfer IDRX payer→vault, create PaymentRecord PDA |
| `confirm_payment` | authority | Mark payment Confirmed, update vault.total_settled |
| `refund_payment` | authority | Transfer IDRX vault→payer (PDA-signed), mark Refunded |

## Accounts

### Vault PDA
Seeds: `["vault"]`

| Field | Type | Description |
|-------|------|-------------|
| `authority` | Pubkey | Admin wallet that can confirm/refund |
| `idrx_mint` | Pubkey | IDRX mint address |
| `vault_token_account` | Pubkey | Associated token account holding IDRX |
| `total_received` | u64 | Cumulative IDRX received (2 decimals) |
| `total_settled` | u64 | Cumulative IDRX confirmed |
| `total_refunded` | u64 | Cumulative IDRX refunded |
| `payment_count` | u64 | Total payments created |
| `bump` | u8 | PDA bump (254) |

### PaymentRecord PDA
Seeds: `["payment", vault_pubkey, payment_count_le_bytes]`

| Field | Type | Description |
|-------|------|-------------|
| `payer` | Pubkey | User wallet |
| `vault` | Pubkey | Parent vault |
| `amount_idrx` | u64 | Amount in IDRX (2 decimals) |
| `amount_idr` | u64 | Amount in IDR (for display) |
| `merchant_id` | String(32) | Merchant identifier |
| `status` | PaymentStatus | Pending / Confirmed / Refunded / Failed |
| `xendit_reference` | String(64) | Xendit charge reference ID |
| `created_at` | i64 | Unix timestamp |
| `updated_at` | i64 | Unix timestamp |
| `bump` | u8 | PDA bump |

## Development

```bash
# Build
anchor build

# Test (localnet — change Anchor.toml cluster to localnet first)
anchor test

# Deploy to devnet
anchor deploy
```

## IDL
Generated at `idl/solpay.json` — consumed by the webapp to build transactions.
