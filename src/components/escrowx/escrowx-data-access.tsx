'use client'

import {getEscrowxProgram, getEscrowxProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useEscrowxProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEscrowxProgramId(cluster.network as Cluster), [cluster])
  const program = getEscrowxProgram(provider)

  const accounts = useQuery({
    queryKey: ['escrowx', 'all', { cluster }],
    queryFn: () => program.account.escrowx.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['escrowx', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ escrowx: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useEscrowxProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useEscrowxProgram()

  const accountQuery = useQuery({
    queryKey: ['escrowx', 'fetch', { cluster, account }],
    queryFn: () => program.account.escrowx.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['escrowx', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ escrowx: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['escrowx', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ escrowx: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['escrowx', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ escrowx: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['escrowx', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ escrowx: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
