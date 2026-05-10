use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub authority: Pubkey,
    pub idrx_mint: Pubkey,
    pub vault_token_account: Pubkey,
    pub total_received: u64,
    pub total_settled: u64,
    pub total_refunded: u64,
    pub payment_count: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PaymentRecord {
    pub payer: Pubkey,
    pub vault: Pubkey,
    pub amount_idrx: u64,
    pub amount_idr: u64,
    #[max_len(32)]
    pub merchant_id: String,
    pub status: PaymentStatus,
    #[max_len(64)]
    pub xendit_reference: String,
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum PaymentStatus {
    Pending,
    Confirmed,
    Refunded,
    Failed,
}
