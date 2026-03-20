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
// Client component
import PortfolioClient from './PortfolioClient';

// ----------------------------------------------------------------------

export default async function PortfolioPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let stockDataQuote: any[] = [];
  try {
    const stocksResponse = await axios({
      baseURL: process.env.NEXT_PUBLIC_IMAGE_SERVER,
      method: 'GET',
      url: '/yahooapi/quotes',
    });
    const stocksDataList = stocksResponse.data.data;
    const filePath = path.join(process.cwd(), 'public', 'dashboardData.json');
    const jsonFile = await fs.readFile(filePath, 'utf-8');
    const parsedData = JSON.parse(jsonFile);
    stockDataQuote = stocksDataList.map((stock: any, idx: number) => ({
      data: { ...stock, ...parsedData.list[idx].data.result[0].meta },
      quote: parsedData.list[idx].data.result[0].indicators.quote[0],
    }));
  } catch (e) {
    console.error('Error fetching stocks:', e);
  }

  const plainStocks = JSON.parse(JSON.stringify(stockDataQuote));

  return <PortfolioClient stockDataQuote={plainStocks} />;
}
