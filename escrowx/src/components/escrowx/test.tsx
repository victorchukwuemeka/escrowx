import { useMemo } from 'react';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation } from 'react-query';
import { BN } from '@project-serum/anchor'; // Ensure BN is imported
import { useConnection } from './hooks/useConnection'; // Adjust if needed
import { useCluster } from './hooks/useCluster'; // Adjust if needed
import { useTransactionToast } from './hooks/useTransactionToast'; // Adjust if needed
import { useAnchorProvider } from './hooks/useAnchorProvider'; // Adjust if needed

export function useEscrowxProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  
  const programId = useMemo(() => getEscrowxProgramId(cluster.network as Cluster), [cluster]);
  const program = getEscrowxProgram(provider);

  const accounts = useQuery({
    queryKey: ['escrowx', 'all', { cluster }],
    queryFn: () => program.account.escrowAccount.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initializeEscrow = useMutation({
    mutationKey: ['escrowx', 'initialize', { cluster }],
    mutationFn: ({ escrowKeypair, amount, buyer, seller }: 
      { escrowKeypair: Keypair, amount: number, buyer: PublicKey, seller: PublicKey }) => {

      const amountBN = new BN(amount.toString());  // Convert amount to BN
      
      return program.methods
        .initializeEscrow(amountBN)  // Pass BN amount
        .accounts({
          escrow: escrowKeypair.publicKey,
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
