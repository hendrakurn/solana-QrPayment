use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, TransferChecked};

use crate::error::SolPayError;
use crate::state::{PaymentRecord, PaymentStatus, Vault};

#[derive(Accounts)]
pub struct RefundPayment<'info> {
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
        associated_token::mint = idrx_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = idrx_mint,
        associated_token::authority = payer,
    )]
    pub payer_token_account: Account<'info, TokenAccount>,

    /// CHECK: Original payer receiving refund, validated via payment_record.payer
    #[account(
        constraint = payer.key() == payment_record.payer
    )]
    pub payer: UncheckedAccount<'info>,

    pub idrx_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = payment_record.vault == vault.key(),
        constraint = payment_record.status == PaymentStatus::Pending @ SolPayError::PaymentNotPending,
    )]
    pub payment_record: Account<'info, PaymentRecord>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<RefundPayment>) -> Result<()> {
    let amount = ctx.accounts.payment_record.amount_idrx;

    let seeds = &[b"vault".as_ref(), &[ctx.accounts.vault.bump]];
    let signer_seeds = &[&seeds[..]];

    let transfer_accounts = TransferChecked {
        from: ctx.accounts.vault_token_account.to_account_info(),
        mint: ctx.accounts.idrx_mint.to_account_info(),
        to: ctx.accounts.payer_token_account.to_account_info(),
        authority: ctx.accounts.vault.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        transfer_accounts,
        signer_seeds,
    );
    token::transfer_checked(cpi_ctx, amount, ctx.accounts.idrx_mint.decimals)?;

    let payment = &mut ctx.accounts.payment_record;
    payment.status = PaymentStatus::Refunded;
    payment.updated_at = Clock::get()?.unix_timestamp;

    let vault = &mut ctx.accounts.vault;
    vault.total_refunded = vault
        .total_refunded
        .checked_add(amount)
        .ok_or(SolPayError::ArithmeticOverflow)?;

    Ok(())
}
