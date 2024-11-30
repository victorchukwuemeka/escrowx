// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import EscrowxIDL from '../target/idl/escrowx.json'
import type { Escrowx } from '../target/types/escrowx'

// Re-export the generated IDL and type
export { Escrowx, EscrowxIDL }

// The programId is imported from the program IDL.
export const ESCROWX_PROGRAM_ID = new PublicKey(EscrowxIDL.address)

// This is a helper function to get the Escrowx Anchor program.
export function getEscrowxProgram(provider: AnchorProvider) {
  return new Program(EscrowxIDL as Escrowx, provider)
}

// This is a helper function to get the program ID for the Escrowx program depending on the cluster.
export function getEscrowxProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Escrowx program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return ESCROWX_PROGRAM_ID
  }
}
