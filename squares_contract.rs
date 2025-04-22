use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod football_squares {
    use super::*;

    pub fn create_board(
        ctx: Context<CreateBoard>,
        entry_fee: u64,
        payout_structure: Vec<u8>, // Example: [50, 25, 15, 10] for 4 quarters
        accepted_token: Pubkey,
        game_details: String,
    ) -> Result<()> {
        let board = &mut ctx.accounts.board;
        board.creator = *ctx.accounts.user.key;
        board.entry_fee = entry_fee;
        board.payout_structure = payout_structure;
        board.accepted_token = accepted_token;
        board.game_details = game_details;
        board.squares = vec![None; 100]; // 10x10 grid
        board.is_active = true;
        Ok(())
    }

    pub fn buy_square(ctx: Context<BuySquare>, row: u8, col: u8) -> Result<()> {
        let board = &mut ctx.accounts.board;
        require!(board.is_active, ErrorCode::BoardNotActive);
        require!(row < 10 && col < 10, ErrorCode::InvalidSquare);

        let square_index = (row * 10 + col) as usize;
        require!(board.squares[square_index].is_none(), ErrorCode::SquareAlreadyTaken);

        // TODO: Implement token transfer logic using accepted_token and entry_fee
        //       This will likely involve CPI to the token program

        board.squares[square_index] = Some(*ctx.accounts.user.key);
        Ok(())
    }

    // TODO: Implement update_results function that interacts with Chainlink oracle
    //       and distributes payouts based on the oracle data and payout_structure.
    //       This function will likely be called by the program authority after
    //       the game concludes.
}

#[derive(Accounts)]
pub struct CreateBoard<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8 + 255 + 32 + 255 + (100 * (1 + 32)) + 1)]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuySquare<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    #[account(mut)]
    pub user: Signer<'info>,
    // TODO: Add token program account if needed for token transfers
}

#[account]
pub struct Board {
    pub creator: Pubkey,
    pub entry_fee: u64,
    pub payout_structure: Vec<u8>,
    pub accepted_token: Pubkey,
    pub game_details: String,
    pub squares: Vec<Option<Pubkey>>,
    pub is_active: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The board is not active.")]
    BoardNotActive,
    #[msg("Invalid square coordinates.")]
    InvalidSquare,
    #[msg("Square already taken.")]
    SquareAlreadyTaken,
    // TODO: Add more error codes as needed
}