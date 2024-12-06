'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'
import { ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useEscrowxProgram, useEscrowxProgramAccount } from './escrowx-data-access'
import { useState } from 'react'



/*export function EscrowxCreate() {
  const { initializeEscrow } = useEscrowxProgram();
  const [amount, setAmount] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');
  const [seller, setSeller] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate inputs
      if (!amount || !buyer || !seller) {
        alert('Please fill in all fields.');
        return;
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        return;
      }

      await initializeEscrow.mutateAsync({
        escrowKeypair: Keypair.generate(),
        amount: parsedAmount,
        buyer: new PublicKey(buyer),
        seller: new PublicKey(seller),
      });

      // Clear the form after successful submission
      setAmount('');
      setBuyer('');
      setSeller('');
      alert('Escrow successfully created!');
    } catch (error) {
      console.error('Failed to initialize escrow:', error);
      alert('Failed to create escrow. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Create Escrow</h2>
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text">Amount (SOL)</span>
        </label>
        <input
          type="text"
          placeholder="Enter escrow amount"
          className="input input-bordered"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Buyer Public Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter buyer's public key"
          className="input input-bordered"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Seller Public Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter seller's public key"
          className="input input-bordered"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
        />
      </div>
      <button
        className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={isSubmitting || initializeEscrow.isPending}
      >
        {isSubmitting || initializeEscrow.isPending ? 'Creating...' : 'Create Escrow'}
      </button>
    </div>
  );
}*/



export function EscrowxCreate() {
  const { initializeEscrow } = useEscrowxProgram(); // Verify if this hook and its returned object are correct
  const [amount, setAmount] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');
  const [seller, setSeller] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("Submitting form with values:", { amount, buyer, seller });

      setIsSubmitting(true);

      // **Validation: Check if inputs are filled**
      if (!amount || !buyer || !seller) {
        alert('Please fill in all fields.');
        console.error("Validation error: Fields are missing", { amount, buyer, seller });
        return;
      }

      // **Validation: Check if the amount is valid**
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Please enter a valid amount greater than 0.');
        console.error("Validation error: Invalid amount", { amount });
        return;
      }

      // **Validation: Check if buyer and seller public keys are valid**
      try {
        new PublicKey(buyer); // This will throw an error if the key is invalid
        new PublicKey(seller);
      } catch (err) {
        alert('Invalid public key format for buyer or seller.');
        console.error("Validation error: Invalid public key", { buyer, seller });
        return;
      }

      console.log("Form data is valid. Initializing escrow...");

      // **Mutation: Call initializeEscrow**
      await initializeEscrow.mutateAsync({
        escrowKeypair: Keypair.generate(),
        amount: parsedAmount,
        buyer: new PublicKey(buyer),
        seller: new PublicKey(seller),
      });

      // **Success: Clear form and notify user**
      setAmount('');
      setBuyer('');
      setSeller('');
      alert('Escrow successfully created!');
      console.log("Escrow successfully created.");
    } catch (error) {
      // **Error: Log and alert user**
      console.error('Failed to initialize escrow:', error);
      alert('Failed to create escrow. Please check the console for more details.');
    } finally {
      setIsSubmitting(false);
      console.log("Submission complete.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Create Escrow</h2>
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text">Amount (SOL)</span>
        </label>
        <input
          type="text"
          placeholder="Enter escrow amount"
          className="input input-bordered"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Buyer Public Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter buyer's public key"
          className="input input-bordered"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
        />
        <label className="label">
          <span className="label-text">Seller Public Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter seller's public key"
          className="input input-bordered"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
        />
      </div>
      <button
        className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={isSubmitting || initializeEscrow.isPending}
      >
        {isSubmitting || initializeEscrow.isPending ? 'Creating...' : 'Create Escrow'}
      </button>
    </div>
  );
}



//component to list all escrow
export function EscrowxList() {
  const { accounts, getProgramAccount } = useEscrowxProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <EscrowxCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}







//component for managing individual account 
function EscrowxCard({ account }: { account: PublicKey }) {
  const { accountQuery, completeEscrow, disputeEscrow } = useEscrowxProgramAccount({
    account,
  })
  return accountQuery.isLoading ?(
    <span className="loading loading-spinner loading-lg"></span>
  ):(
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" 
          onClick={() => accountQuery.refetch()}>
            Escrow Account
          </h2>
          <p>Buyer: {ellipsify(accountQuery.data?.buyer.toString() ?? '')}</p>
          <p>Seller: {ellipsify(accountQuery.data?.seller.toString() ?? '')}</p>
          <p>Amount: {accountQuery.data?.amount ?? 0} SOL</p>
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline btn-success"
              onClick={() => completeEscrow.mutateAsync()}
              disabled={completeEscrow.isPending}
            >
              Complete Escrow
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline btn-warning"
              onClick={() => disputeEscrow.mutateAsync()}
              disabled={disputeEscrow.isPending}
            >
              Dispute Escrow
            </button>
          </div>
          <div className="text-center space-y-4">
            <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
          </div>
        </div>
      </div>
    </div>
  )
}
