#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod escrowx {
    use super::*;

  pub fn close(_ctx: Context<CloseEscrowx>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.escrowx.count = ctx.accounts.escrowx.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.escrowx.count = ctx.accounts.escrowx.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeEscrowx>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.escrowx.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeEscrowx<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Escrowx::INIT_SPACE,
  payer = payer
  )]
  pub escrowx: Account<'info, Escrowx>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseEscrowx<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub escrowx: Account<'info, Escrowx>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub escrowx: Account<'info, Escrowx>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrowx {
  count: u8,
}
