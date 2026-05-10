use anchor_lang::prelude::*;

use crate::error::SolPayError;
use crate::state::Vault;

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(
        mut,
        constraint = authority.key() == vault.authority @ SolPayError::Unauthorized,
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump,
        close = authority,
    )]
    pub vault: Account<'info, Vault>,

    pub system_program: Program<'info, System>,
}

pub fn handler(_ctx: Context<CloseVault>) -> Result<()> {
    Ok(())
}
