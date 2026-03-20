import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'investment list',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import { getCurrentUser } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import axios from 'axios';
// Client component
import InvestAllClient from './InvestAllClient';

// ----------------------------------------------------------------------

// Cache stock data for 5 minutes
const getCachedStockData = unstable_cache(
  async (uniqueStockString: string) => {
    if (!uniqueStockString) {
      return [];
    }
    const stocksResponse = await axios({
      baseURL: process.env.NEXT_PUBLIC_IMAGE_SERVER,
      method: 'GET',
      url: '/yahooapi/quotes',
      params: {
        symbols: uniqueStockString,
      },
    });
    return stocksResponse.data.data;
  },
  ['stock-data'],
  { revalidate: 300, tags: ['stock-data'] }
);

// ----------------------------------------------------------------------

async function getInvestmentsData(userId: string) {
  await dbConnect();

  const allInvestments = await Investment.find({
    userId: userId,
    transactionId: { $exists: true },
  }).lean();

  // Build unique stock string for API call
  const uniqueStockString = Array.from(
    new Set(
      allInvestments.map((x) =>
        x.stock === 'usdt' || x.stock === 'btc'
          ? `${x.stock.toUpperCase()}-USD`
          : x.stock.toUpperCase()
      )
    )
  ).join(',');

  // Fetch stock market data
  const stocksDataList = await getCachedStockData(uniqueStockString);
  
  // Create a map of stock data
  const stocksDataMap = stocksDataList.reduce((acc: Record<string, any>, stock: any) => {
    acc[stock.symbol] = stock;
    return acc;
  }, {} as Record<string, any>);

  // Map investments with stock data
  const investmentsWithStockData = allInvestments.map((x) => ({
    ...x,
    stock:
      stocksDataMap[
        x.stock === 'usdt' || x.stock === 'btc'
          ? `${x.stock.toUpperCase()}-USD`
          : x.stock.toUpperCase()
      ],
  }));

  return investmentsWithStockData;
}

// ----------------------------------------------------------------------

export default async function AllInvestmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const investmentsWithStockData = await getInvestmentsData(user._id);

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainInvestments = JSON.parse(JSON.stringify(investmentsWithStockData));

  return <InvestAllClient user={plainUser} allInvestments={plainInvestments} />;
}
