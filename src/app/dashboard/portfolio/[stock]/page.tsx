import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'All Plans',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import stocks from '@/helpers/stocks';
// Client component
import PortfolioStockClient from './PortfolioStockClient';

// ----------------------------------------------------------------------

export default async function PortfolioStockPage({ params }: { params: { stock: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!(stocks as Record<string, any>)[params.stock]) {
    redirect('/dashboard/portfolio');
  }

  let stockData: any = null;
  let quoteData: any = null;

  try {
    const stockResponse = await axios({
      baseURL: process.env.NEXT_PUBLIC_IMAGE_SERVER,
      method: 'GET',
      url: '/yahooapi/quotes',
      params: { symbols: params.stock },
    });
    const filePath = path.join(process.cwd(), 'public', 'dashboardData.json');
    const jsonFile = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(jsonFile);
    const stockParsedData = parsedData.list.find(
      (item: any) => item.data.result[0].meta.symbol === params.stock
    );
    stockData = stockResponse.data.data[0];
    quoteData = {
      timestamp: stockParsedData.data.result[0].timestamp,
      quotes: stockParsedData.data.result[0].indicators.quote[0],
    };
  } catch (e) {
    console.error('Error fetching stock data:', e);
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainStockData = JSON.parse(JSON.stringify(stockData));
  const plainQuoteData = JSON.parse(JSON.stringify(quoteData));

  return (
    <PortfolioStockClient
      user={plainUser}
      stockData={plainStockData}
      quoteData={plainQuoteData}
    />
  );
}
