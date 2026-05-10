use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::Vault;

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,

    pub idrx_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        associated_token::mint = idrx_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeVault>) -> Result<()> {
    let vault = &mut ctx.accounts.vault;
    vault.authority = ctx.accounts.authority.key();
    vault.idrx_mint = ctx.accounts.idrx_mint.key();
    vault.vault_token_account = ctx.accounts.vault_token_account.key();
    vault.total_received = 0;
    vault.total_settled = 0;
    vault.total_refunded = 0;
    vault.payment_count = 0;
    vault.bump = ctx.bumps.vault;
    Ok(())
}
