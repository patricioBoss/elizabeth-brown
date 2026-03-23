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
  // Handle browser favicon requests and invalid stock symbols
  if (params.stock === 'favicon.ico' || !(stocks as Record<string, any>)[params.stock]) {
    redirect('/dashboard/portfolio');
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
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
    // console.log('Stock API response:', stockResponse.data);
    const filePath = path.join(process.cwd(), 'public', 'dashboardData.json');
    const jsonFile = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(jsonFile);
    // console.log('Parsed dashboard data:', parsedData);
    const stockParsedData = parsedData.list.find(
      (item: any) => item.data.result[0].meta.symbol === params.stock
    );
    // console.log('Found stock data:', JSON.stringify(stockParsedData,null,2));
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

  // console.log('Final stockData:', JSON.stringify(plainStockData,null,2));
  // console.log('Final quoteData:', JSON.stringify(plainQuoteData,null,2));
  

  return (
    <PortfolioStockClient
      user={plainUser}
      stockData={plainStockData}
      quoteData={plainQuoteData}
    />
  );
}
