rust
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); // Replace with your program ID

#[program]
pub mod token_management {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, accepted_tokens: Vec<Pubkey>) -> Result<()> {
        let token_manager = &mut ctx.accounts.token_manager;
        token_manager.accepted_tokens = accepted_tokens;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let token_manager = &ctx.accounts.token_manager;
        require!(
            token_manager.accepted_tokens.contains(&ctx.accounts.user_token_account.mint),
            TokenManagementError::TokenNotAccepted
        );

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    // Add more functions for token conversions if needed, using a DEX or price oracle
    // Example (requires integration with a DEX like Raydium or a price oracle like Chainlink):
    // pub fn convert_tokens(ctx: Context<ConvertTokens>, amount: u64, target_token: Pubkey) -> Result<()> { ... }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + 32 + (4 + 32 * 10))] // Adjust space as needed
    pub token_manager: Account<'info, TokenManager>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub token_manager: Account<'info, TokenManager>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// Add more accounts structs for token conversions if needed

#[account]
pub struct TokenManager {
    pub accepted_tokens: Vec<Pubkey>,
    // Add other relevant fields
}

#[error_code]
pub enum TokenManagementError {
    #[msg("Token not accepted")]
    TokenNotAccepted,
    // Add more errors
}