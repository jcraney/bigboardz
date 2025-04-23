use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use switchboard_v2::AggregatorAccountData;


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
        switchboard_feed: Pubkey,
        switchboard_queue: Pubkey,
    ) -> Result<()> {
        let board = &mut ctx.accounts.board;
        board.creator = *ctx.accounts.user.key;
        board.entry_fee = entry_fee;
        board.payout_structure = payout_structure;
        board.accepted_token = accepted_token;
        board.game_details = game_details;
        board.squares = vec![None; 100]; // 10x10 grid
        board.switchboard_feed = switchboard_feed;
        board.switchboard_queue = switchboard_queue;
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

    pub fn update_results(ctx: Context<UpdateResults>) -> Result<()> {
        let board = &mut ctx.accounts.board;
        // Load the aggregator account from the switchboard feed
        let aggregator_account_info = ctx.accounts.switchboard_feed.clone();
        let aggregator = AggregatorAccountData::new(&aggregator_account_info)?;

        // TODO: Call switchboard to get the data from ESPN.com using the feed
        //       We can call the latest_confirmed_round.result to get the result.
        //       This will likely be a struct with the game score.
        //       Example:
        //       let result = aggregator.latest_confirmed_round.result;
        //       let home_team_score = result.home_team_score;
        //       let away_team_score = result.away_team_score;
        
        // TODO: Distribute payouts based on the payout_structure
        //       This will involve checking which squares match the results.
        //       Then transferring the accepted_token to the winners.

        Ok(())
    }
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

#[derive(Accounts)]
pub struct UpdateResults<'info> {
    #[account(mut)]
    pub board: Account<'info, Board>,
    pub switchboard_feed: AccountInfo<'info>
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
    pub switchboard_feed: Pubkey,
    pub switchboard_queue: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The board is not active.")]
    BoardNotActive,
    #[msg("Invalid square coordinates.")]
    InvalidSquare,
    #[msg("Square already taken.")]
    SquareAlreadyTaken,
}