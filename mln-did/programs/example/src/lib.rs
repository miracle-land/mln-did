#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;
use mln_did_cpi::cpi::accounts::{AddService as CpiAddService, Initialize as CpiInitialize};
use mln_did_cpi::cpi::{add_service as cpi_add_service, initialize as cpi_initialize};
use mln_did_cpi::program::MlnDid;
use mln_did_cpi::{DidAccount, Service};

declare_id!("exCJEJeiWNbq13aZaaYVyeWXQ5hjj3r6fn4GtceoR9f");

#[program]
pub mod example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, size: u32) -> Result<()> {
        let cpi_program = ctx.accounts.mln_did_program.to_account_info();
        let cpi_accounts = CpiInitialize {
            did_data: ctx.accounts.did_data.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
            payer: ctx.accounts.payer.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        cpi_initialize(cpi_ctx, size)
    }

    pub fn add_service(
        ctx: Context<AddService>,
        fragment: String,
        service_type: String,
        service_endpoint: String,
    ) -> Result<()> {
        let cpi_program = ctx.accounts.mln_did_program.to_account_info();
        let cpi_accounts = CpiAddService {
            did_data: ctx.accounts.did_data.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        cpi_add_service(
            cpi_ctx,
            Service {
                fragment,
                service_type,
                service_endpoint,
            },
            false,
            None,
        )
    }
}

#[derive(Accounts)]
#[instruction(size: u32)]
pub struct Initialize<'info> {
    #[account(mut)]
    /// CHECK: Checked in the DID program
    pub did_data: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub mln_did_program: Program<'info, MlnDid>,
}

#[derive(Accounts)]
pub struct AddService<'info> {
    #[account(mut)]
    pub did_data: Account<'info, DidAccount>,
    pub authority: Signer<'info>,
    pub mln_did_program: Program<'info, MlnDid>,
}
