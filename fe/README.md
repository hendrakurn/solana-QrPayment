# SolPay Frontend

Next.js frontend for SolPay — IDRX payments on Solana via QR scan.

## Important Addresses (Devnet)

| Name | Address | Explorer |
|------|---------|---------|
| Program | `35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ` | [↗](https://explorer.solana.com/address/35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ?cluster=devnet) |
| IDRX Mint | `FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM` | [↗](https://explorer.solana.com/address/FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM?cluster=devnet) |
| Vault PDA | `92DtDU3efr54phKtxCtXKuv6WnkAV2mpvTgSaybK2JnP` | [↗](https://explorer.solana.com/address/92DtDU3efr54phKtxCtXKuv6WnkAV2mpvTgSaybK2JnP?cluster=devnet) |
| Vault Token Account | `DA3xxP5eM4bo1p7KwYRvSLJs3Mv4XmiQEFEAf5VZS72f` | [↗](https://explorer.solana.com/address/DA3xxP5eM4bo1p7KwYRvSLJs3Mv4XmiQEFEAf5VZS72f?cluster=devnet) |
| Authority Wallet | `9Nxj6oHYk7VkqKTDL9DZX2y4R6zgE4sTjMR9b29mJ9RY` | [↗](https://explorer.solana.com/address/9Nxj6oHYk7VkqKTDL9DZX2y4R6zgE4sTjMR9b29mJ9RY?cluster=devnet) |

## Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLPAY_PROGRAM_ID=35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ
NEXT_PUBLIC_IDRX_MINT=FDaKsnp8yT3LW8kTPz8uQZQjQ4EGr5PdmQEkpBTqFbCM
```

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
