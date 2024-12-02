'use client'

import { getEscrowxProgram, getEscrowxProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useEscrowxProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEscrowxProgramId(cluster.network as Cluster), [cluster])
  const program = getEscrowxProgram(provider)

  const accounts = useQuery({
    queryKey: ['escrowx', 'all', { cluster }],
    queryFn: () => program.account.escrowAccount.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initializeEscrow = useMutation({
    mutationKey: ['escrowx', 'initialize', { cluster }],
    mutationFn: ({ escrowKeypair, amount, buyer, seller }: { escrowKeypair: Keypair; amount: number; buyer: PublicKey; seller: PublicKey }) =>
      program.methods
        .initializeEscrow(amount)
        .accounts({
          escrow: escrowKeypair.publicKey,
          buyer,
          seller,
          systemProgram: PublicKey.default,
        })
        .signers([escrowKeypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize escrow'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initializeEscrow,
  }
}

export function useEscrowxProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useEscrowxProgram()

  const accountQuery = useQuery({
    queryKey: ['escrowx', 'fetch', { cluster, account }],
    queryFn: () => program.account.escrowAccount.fetch(account),
  })

  const completeEscrow = useMutation({
    mutationKey: ['escrowx', 'complete', { cluster, account }],
    mutationFn: () =>
      program.methods
        .completeEscrow()
        .accounts({
          escrow: account,
          buyer: accountQuery.data?.buyer,
        })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
    onError: () => toast.error('Failed to complete escrow'),
  })

  const disputeEscrow = useMutation({
    mutationKey: ['escrowx', 'dispute', { cluster, account }],
    mutationFn: () =>
      program.methods
        .disputeEscrow()
        .accounts({
          escrow: account,
          buyer: accountQuery.data?.buyer,
        })
        .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
    onError: () => toast.error('Failed to dispute escrow'),
  })

  return {
    accountQuery,
    completeEscrow,
    disputeEscrow,
  }
}
