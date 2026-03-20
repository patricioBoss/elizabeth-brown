import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

// POST - Fetch latest coin prices and cache them to public/coinData.json
export async function POST() {
  try {
    const { data } = await axios.get(
      'https://rest.coinapi.io/v1/assets?filter_asset_id=BTC,USDT,ETH,XRP,DOGE',
      {
        headers: {
          'X-CoinAPI-Key': process.env.COINAPI_KEY || '5889e982-099b-4beb-8aab-92cb80183548',
        },
      }
    );

    const coinPrices = (data as any[]).reduce(
      (acc: Record<string, any>, coindata: any) => {
        acc[coindata.asset_id] = coindata;
        return acc;
      },
      {}
    );

    const filePath = path.join(process.cwd(), 'public', 'coinData.json');
    await fs.writeFile(filePath, JSON.stringify(coinPrices, null, 2), 'utf-8');

    return NextResponse.json(
      { message: 'success', data: coinPrices },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating coin prices:', error);
    return NextResponse.json(
      { message: 'failure', error: error.message },
      { status: 500 }
    );
  }
}
