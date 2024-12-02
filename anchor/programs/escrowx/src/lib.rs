#![allow(clippy::result_large_err)]


use anchor_lang::prelude::*;


declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod escrowx {
    use super::*;

    pub fn initialize_escrow(ctx :Context<InitializeEscrow>, amount:u64, )->Result<()>
    {
      let escrow = &mut ctx.accounts.escrow;
      escrow.amount = amount;
      escrow.seller =  *ctx.accounts.seller.key;
      escrow.buyer =  *ctx.accounts.buyer.key;
      escrow.status = EscrowStatus::Pending;
      Ok(())
    }

    pub fn complete_escrow(ctx : Context<CompleteEscrow>)->Result<()>
    {
      let escrow =  &mut  ctx.accounts.escrow;
      require!(escrow.status == EscrowStatus::Pending, EscrowError::InvalidStatus);
      escrow.status = EscrowStatus::Completed;
      Ok(())
    }

    pub fn dispute_escrow(ctx : Context<DisputeEscrow>)->Result<()>
    {
      let escrow = &mut  ctx.accounts.escrow;
      require!(escrow.status == EscrowStatus::Pending, EscrowError::InvalidStatus);
      escrow.status = EscrowStatus::Disputed;
      Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        payer = buyer,
        space = 8 + 32 + 32 + 8 + 1
    )]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub seller: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}




#[derive(Accounts)]
pub struct CompleteEscrow<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    pub buyer: Signer<'info>,
}


#[derive(Accounts)]
pub struct DisputeEscrow<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    pub buyer: Signer<'info>,
}


#[account]
pub struct EscrowAccount {
  pub buyer : Pubkey,
  pub seller: Pubkey,
  pub amount: u64,
  pub status: EscrowStatus,
} 



#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum EscrowStatus {
    Pending,
    Completed,
    Disputed,
}

#[error_code]
pub enum EscrowError {
    InvalidStatus,
}