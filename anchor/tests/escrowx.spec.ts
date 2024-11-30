import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Escrowx} from '../target/types/escrowx'

describe('escrowx', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Escrowx as Program<Escrowx>

  const escrowxKeypair = Keypair.generate()

  it('Initialize Escrowx', async () => {
    await program.methods
      .initialize()
      .accounts({
        escrowx: escrowxKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([escrowxKeypair])
      .rpc()

    const currentCount = await program.account.escrowx.fetch(escrowxKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Escrowx', async () => {
    await program.methods.increment().accounts({ escrowx: escrowxKeypair.publicKey }).rpc()

    const currentCount = await program.account.escrowx.fetch(escrowxKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Escrowx Again', async () => {
    await program.methods.increment().accounts({ escrowx: escrowxKeypair.publicKey }).rpc()

    const currentCount = await program.account.escrowx.fetch(escrowxKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Escrowx', async () => {
    await program.methods.decrement().accounts({ escrowx: escrowxKeypair.publicKey }).rpc()

    const currentCount = await program.account.escrowx.fetch(escrowxKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set escrowx value', async () => {
    await program.methods.set(42).accounts({ escrowx: escrowxKeypair.publicKey }).rpc()

    const currentCount = await program.account.escrowx.fetch(escrowxKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the escrowx account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        escrowx: escrowxKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.escrowx.fetchNullable(escrowxKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
