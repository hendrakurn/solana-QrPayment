#!/usr/bin/env bash
set -e

WALLET="./wallet.json"
CLUSTER="devnet"
CLUSTER_URL="https://api.devnet.solana.com"

echo "=== SolPay Devnet Deploy ==="
echo "Wallet: $(solana-keygen pubkey $WALLET)"

# Set solana config to devnet
solana config set --url $CLUSTER_URL --keypair $WALLET

# Check balance
BALANCE=$(solana balance --url $CLUSTER_URL $(solana-keygen pubkey $WALLET) | awk '{print $1}')
echo "Balance: $BALANCE SOL"

# Airdrop if balance < 2 SOL
if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "Balance low — requesting airdrop..."
  solana airdrop 2 $(solana-keygen pubkey $WALLET) --url $CLUSTER_URL
  sleep 3
fi

# Build before deploy
echo "Building..."
NO_DNA=1 anchor build

# Deploy to devnet
echo "Deploying to devnet..."
NO_DNA=1 anchor deploy --provider.cluster $CLUSTER --provider.wallet $WALLET

# Get deployed program ID
PROGRAM_ID=$(solana address -k target/deploy/solpay-keypair.json)
echo ""
echo "=== Deploy Complete ==="
echo "Program ID: $PROGRAM_ID"
echo "Explorer:   https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
