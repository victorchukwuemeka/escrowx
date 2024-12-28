'use client';

import { AppHero } from '../ui/ui-layout';
import { useEffect } from 'react';
import QuickNodeBalanceStream from '../QuickNodeBalanceStream';

const QuickNodeStream = () => {
  useEffect(() => {
    const fetchStream = async () => {
      const myHeaders = new Headers();
      myHeaders.append('accept', 'application/json');
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('x-api-key', 'QN_bde2977ddfcf40f59f7616ab7f7c3a64'); // Replace with your actual API key

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow' as RequestRedirect,
        body: JSON.stringify({
          name: 'My Solana Stream',
          network: 'solana-devnet', // Updated for Solana Devnet
          dataset: 'block',
          filter_function:
            'CmZ1bmN0aW9uIG1haW4oZGF0YSkgewogIHJldHVybiBkYXRhLnByb2dyYW1faWQgPT09ICJBc2paM2tXQVVTUVJOdDJwWlZlSmt5d2haNmdwTHBIWm1KamR1UG1LWkRaWiI7IC8vIFJlcGxhY2UgIllPVVJfUFJPR1JBTV9JRCIgd2l0aCB0aGUgU29sYW5hIHByb2dyYW0gSUQKfQo=',
          region: 'usa_east',
          start_range: 100,
          end_range: 200,
          dataset_batch_size: 1,
          include_stream_metadata: 'body',
          destination: 'webhook',
          fix_block_reorgs: 0,
          keep_distance_from_tip: 0,
          destination_attributes: {
            url: 'https://webhook.site', // Update to your webhook if needed
            compression: 'none',
            headers: {
              'Content-Type': 'Test',
              Authorization: 'again',
            },
            max_retry: 3,
            retry_interval_sec: 1,
            post_timeout_sec: 10,
          },
          status: 'active',
        }),
      };

      try {
        const response = await fetch(
          'https://api.quicknode.com/streams/rest/v1/streams',
          requestOptions
        );
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error('Error creating stream:', error);
      }
    };

    fetchStream();
  }, []);

  return null;
};

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
      <QuickNodeStream /> {/* Add the QuickNodeStream functionality */}

      <div>
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-gray-700">
          Stay updated with real-time balance changes directly from the Solana Devnet.
        </p>
      </div>
        <QuickNodeBalanceStream/>
      </div>
    </div>
  );
}
