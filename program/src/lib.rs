//! SOL program
#![deny(missing_docs)]

use {
    crate::{borsh as program_borsh, error::SolError, processor::is_authority, state::SolData},
    solana_program::{
        account_info::AccountInfo, entrypoint::ProgramResult, program_error::ProgramError,
    },
};

pub mod borsh;
mod entrypoint;
pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

// Export current SDK types for downstream users building with a different SDK version
pub use solana_program;

solana_program::declare_id!("ide3Y2TubNMLLhiG1kDL6to4a8SjxD18YWCYC5BZqNV");

/// Given a DID, validate that the signers contain at least one
/// account that has permissions to sign transactions using the DID.
pub fn validate_owner(did: &AccountInfo, signers: &[&AccountInfo]) -> ProgramResult {
    if did.owner.ne(&id()) {
        return Err(ProgramError::IncorrectProgramId);
    }
    let sol = program_borsh::try_from_slice_incomplete::<SolData>(*did.data.borrow())?;

    if signers.iter().any(|s| s.is_signer && is_authority(s, &sol)) {
        Ok(())
    } else {
        Err(SolError::IncorrectAuthority.into())
    }
}
