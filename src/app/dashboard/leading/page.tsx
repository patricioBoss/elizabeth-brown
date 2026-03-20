import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Leaders Board',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import Dummy from '@/models/dummy.model';
import axios from 'axios';
// Client component
import LeadingClient from './LeadingClient';

// ----------------------------------------------------------------------

// Cache only the CoinGecko API data for 30 minutes
const getCachedMarketData = unstable_cache(
  async () => {
    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', ids: 'bitcoin,tether,ethereum' },
    });
    return res.data;
  },
  ['market-data'],
  { revalidate: 1800, tags: ['market-data'] }
);

// ----------------------------------------------------------------------

async function getLeadersData() {
  try {
    const [marketData, investments, withdrawals] = await Promise.all([
      getCachedMarketData(),
      Dummy.aggregate([
        { $match: { type: 'investment' } },
        { $sort: { approvedAt: -1 } },
        { $limit: 30 },
      ]).exec(),
      Dummy.aggregate([
        { $match: { type: 'withdrawal' } },
        { $sort: { approvedAt: -1 } },
        { $limit: 30 },
      ]).exec(),
    ]);

    return {
      marketData,
      investments,
      withdrawals,
    };
  } catch (err) {
    console.error('Leaders data error:', err);
    return {
      marketData: [],
      investments: [],
      withdrawals: [],
    };
  }
}

// ----------------------------------------------------------------------

export default async function LeadersBoardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  const { marketData, investments, withdrawals } = await getLeadersData();

  const plainMarketData = JSON.parse(JSON.stringify(marketData));
  const plainInvestments = JSON.parse(JSON.stringify(investments));
  const plainWithdrawals = JSON.parse(JSON.stringify(withdrawals));

  return (
    <LeadingClient
      marketData={plainMarketData}
      investments={plainInvestments}
      withdrawals={plainWithdrawals}
    />
  );
}
