use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, TransferChecked};

use crate::error::SolPayError;
use crate::state::{PaymentRecord, PaymentStatus, Vault};

#[derive(Accounts)]
#[instruction(amount_idrx: u64, amount_idr: u64, merchant_id: String, xendit_reference: String)]
pub struct CreatePayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

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

    pub idrx_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = 8 + PaymentRecord::INIT_SPACE,
        seeds = [b"payment", vault.key().as_ref(), &vault.payment_count.to_le_bytes()],
        bump
    )]
    pub payment_record: Account<'info, PaymentRecord>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreatePayment>,
    amount_idrx: u64,
    amount_idr: u64,
    merchant_id: String,
    xendit_reference: String,
) -> Result<()> {
    require!(amount_idrx > 0, SolPayError::InvalidAmount);
    require!(amount_idr > 0, SolPayError::InvalidAmount);
    require!(!merchant_id.is_empty(), SolPayError::InvalidMerchantId);

    let transfer_accounts = TransferChecked {
        from: ctx.accounts.payer_token_account.to_account_info(),
        mint: ctx.accounts.idrx_mint.to_account_info(),
        to: ctx.accounts.vault_token_account.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_accounts,
    );
    token::transfer_checked(cpi_ctx, amount_idrx, ctx.accounts.idrx_mint.decimals)?;

    let payment = &mut ctx.accounts.payment_record;
    payment.payer = ctx.accounts.payer.key();
    payment.vault = ctx.accounts.vault.key();
    payment.amount_idrx = amount_idrx;
    payment.amount_idr = amount_idr;
    payment.merchant_id = merchant_id;
    payment.status = PaymentStatus::Pending;
    payment.xendit_reference = xendit_reference;
    payment.created_at = Clock::get()?.unix_timestamp;
    payment.updated_at = Clock::get()?.unix_timestamp;
    payment.bump = ctx.bumps.payment_record;

    let vault = &mut ctx.accounts.vault;
    vault.total_received = vault
        .total_received
        .checked_add(amount_idrx)
        .ok_or(SolPayError::ArithmeticOverflow)?;
    vault.payment_count = vault
        .payment_count
        .checked_add(1)
        .ok_or(SolPayError::ArithmeticOverflow)?;

    Ok(())
}
