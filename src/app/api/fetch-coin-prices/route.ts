import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,tether,ripple,dogecoin',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
      },
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch coin prices error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch coin prices', error: error.message },
      { status: 500 }
    );
  }
}
