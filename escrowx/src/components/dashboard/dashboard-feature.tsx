'use client';

import { AppHero } from '../ui/ui-layout';

export default function DashboardFeature() {
  return (
    <div>
      <AppHero 
        title="Welcome to EscrowX" 
        subtitle="Say hi to your new Solana dApp." 
      />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-gray-700">
          EscrowX is here to simplify your decentralized escrow needs. Get started by exploring our features!
        </p>
      </div>
    </div>
  );
}
