use anchor_lang::prelude::*;

#[error_code]
pub enum SolPayError {
    #[msg("Unauthorized: only vault authority can perform this action")]
    Unauthorized,
    #[msg("Payment already processed")]
    PaymentAlreadyProcessed,
    #[msg("Payment not in pending status")]
    PaymentNotPending,
    #[msg("Insufficient IDRX balance")]
    InsufficientBalance,
    #[msg("Invalid amount: must be greater than zero")]
    InvalidAmount,
    #[msg("Invalid merchant ID")]
    InvalidMerchantId,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
}
