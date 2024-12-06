'use client'

import {getEscrowxProgram, getEscrowxProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey, SystemProgram} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'
import { BN } from 'bn.js'
//import { BN } from '@project-serum/anchor'

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
        mutationFn: ({ amount, buyer, seller }: 
          { amount: number, buyer: PublicKey, seller: PublicKey }) => {
          
          // Generate the escrow keypair
          const escrowKeypair = Keypair.generate();
          const escrowAccount = escrowKeypair.publicKey;

          console.log("Generated Escrow Keypair:", escrowAccount.toBase58());


          const amountBN = new BN(amount.toString());  // Convert amount to BN
          
          return program.methods
            .initializeEscrow(amountBN)  // Pass BN amount
            .accounts({
              escrow: escrowAccount,
              buyer,
              seller,
              SystemProgram: SystemProgram.programId,
            })
            .signers([escrowKeypair])
            .rpc();
        },
        onSuccess: (signature) => {
          transactionToast(signature);
          return accounts.refetch();
        },
        onError: (error) => {
          console.error("Failed to initialize escrow:", error);
          let errorMessage = "Failed to initialize escrow. Please try again.";
    
          if (error instanceof Error) {
            errorMessage += ` Error: ${error.message}`;
          }
    
          toast.error(errorMessage); // Show detailed error message
        },
      });
      return {
        program,
        programId,
        accounts,
        getProgramAccount,
        initializeEscrow,
      };
  
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
    mutationKey: ['escrow', 'complete', {cluster, account}],
    mutationFn: ()=> 
      program.methods
        .completeEscrow()
        .accounts({
          escrow: account,
          buyer: accountQuery.data?.buyer,
        })
        .rpc(),
    onSuccess: (tx)=> {
      transactionToast(tx)
      return accountQuery.refetch()
    },
    onError: ()=> toast.error("failed to complete escrow")
  })
  
  const disputeEscrow = useMutation({
    mutationKey: ['escrowx', 'dispute', { cluster, account }],
    mutationFn: () => program.methods.disputeEscrow()
          .accounts({ 
            escrow: account,
            buyer : accountQuery.data?.buyer,
           })
          .rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },

    onError: ()=> toast.error("failed to create dispute"),
  })

  return {
    accountQuery,
    completeEscrow,
    disputeEscrow,
  }
}
