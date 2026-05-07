# SolPay Smart Contract

Anchor program on Solana. Records USDC payments from users to a vault PDA, enabling Indonesian merchant payments via Xendit/GoPay.

## Deployed Program

| Network | Program ID |
|---------|-----------|
| devnet  | `35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ` |

Explorer: https://explorer.solana.com/address/35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ?cluster=devnet

## Instructions

| Instruction | Signer | Description |
|-------------|--------|-------------|
| `initialize_vault` | authority | Create vault PDA + USDC token account |
| `create_payment` | payer | Transfer USDC payer→vault, create PaymentRecord PDA |
| `confirm_payment` | authority | Mark payment Confirmed, update vault.total_settled |
| `refund_payment` | authority | Transfer USDC vault→payer (PDA-signed), mark Refunded |

## Accounts

### Vault PDA
Seeds: `["vault"]`

| Field | Type | Description |
|-------|------|-------------|
| `authority` | Pubkey | Admin wallet that can confirm/refund |
| `usdc_mint` | Pubkey | USDC mint address |
| `vault_token_account` | Pubkey | Associated token account holding USDC |
| `total_received` | u64 | Cumulative USDC received (6 decimals) |
| `total_settled` | u64 | Cumulative USDC confirmed |
| `total_refunded` | u64 | Cumulative USDC refunded |
| `payment_count` | u64 | Total payments created |
| `bump` | u8 | PDA bump |

### PaymentRecord PDA
Seeds: `["payment", vault_pubkey, payment_count_le_bytes]`

| Field | Type | Description |
|-------|------|-------------|
| `payer` | Pubkey | User wallet |
| `vault` | Pubkey | Parent vault |
| `amount_usdc` | u64 | Amount in USDC (6 decimals) |
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
NO_DNA=1 anchor build

# Test (localnet)
NO_DNA=1 anchor test

# Deploy to devnet
bash deploy.sh
```

## USDC Mint (devnet)
`4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

## IDL
Generated at `idl/solpay.json` — consumed by the webapp to build transactions.
