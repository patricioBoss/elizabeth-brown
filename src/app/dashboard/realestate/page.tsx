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
import fs from 'fs/promises';
import path from 'path';
// Client component
import RealestateClient from './RealestateClient';

// ----------------------------------------------------------------------

export default async function RealEstatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Read coin prices from public/coinData.json (mirrors original getCoinPrices())
  const filePath = path.join(process.cwd(), 'public', 'coinData.json');
  let coinList = null;
  try {
    coinList = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {}

  // Serialize to plain objects before passing to Client Component
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainCoinList = coinList ? JSON.parse(JSON.stringify(coinList)) : null;

  return <RealestateClient user={plainUser} coinList={plainCoinList} />;
}
