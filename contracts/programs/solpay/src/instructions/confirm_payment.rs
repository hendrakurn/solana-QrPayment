use anchor_lang::prelude::*;

use crate::error::SolPayError;
use crate::state::{PaymentRecord, PaymentStatus, Vault};

#[derive(Accounts)]
pub struct ConfirmPayment<'info> {
    #[account(
        constraint = authority.key() == vault.authority @ SolPayError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        constraint = payment_record.vault == vault.key(),
        constraint = payment_record.status == PaymentStatus::Pending @ SolPayError::PaymentNotPending,
    )]
    pub payment_record: Account<'info, PaymentRecord>,
}

pub fn handler(ctx: Context<ConfirmPayment>) -> Result<()> {
    let payment = &mut ctx.accounts.payment_record;
    payment.status = PaymentStatus::Confirmed;
    payment.updated_at = Clock::get()?.unix_timestamp;

    let vault = &mut ctx.accounts.vault;
    vault.total_settled = vault
        .total_settled
        .checked_add(payment.amount_idrx)
        .ok_or(SolPayError::ArithmeticOverflow)?;

    Ok(())
}
