use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("35SH4CwgcAjTD23RFVvB63jANFo7cMraqMsKxRunHBdJ");

#[program]
pub mod solpay {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        instructions::initialize_vault::handler(ctx)
    }

    pub fn create_payment(
        ctx: Context<CreatePayment>,
        amount_usdc: u64,
        amount_idr: u64,
        merchant_id: String,
        xendit_reference: String,
    ) -> Result<()> {
        instructions::create_payment::handler(
            ctx,
            amount_usdc,
            amount_idr,
            merchant_id,
            xendit_reference,
        )
    }

    pub fn confirm_payment(ctx: Context<ConfirmPayment>) -> Result<()> {
        instructions::confirm_payment::handler(ctx)
    }

    pub fn refund_payment(ctx: Context<RefundPayment>) -> Result<()> {
        instructions::refund_payment::handler(ctx)
    }
}
