'use client';

import { Container, Typography } from '@mui/material';
import { useState, useMemo } from 'react';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import LeadersTable from '@/components/dashboard/LeadersTable';

// ----------------------------------------------------------------------

interface CoinData {
  symbol: string;
  image: string;
  name: string;
  current_price: number;
}

interface RowData {
  _id: string;
  lastName: string;
  firstName: string;
  approvedAt: string;
  coin: string;
  amount: number;
  type: string;
}

interface LeadingClientProps {
  marketData: CoinData[];
  investments: RowData[];
  withdrawals: RowData[];
}

// ----------------------------------------------------------------------

export default function LeadingClient({ marketData, investments, withdrawals }: LeadingClientProps) {
  const { themeStretch } = useSettings();
  const [order, setOrder] = useState<'deposit' | 'withdrawal'>('deposit');

  const coinMap = useMemo(
    () =>
      marketData.reduce((acc: Record<string, CoinData>, x: CoinData) => {
        acc[x.symbol] = x;
        return acc;
      }, {}),
    [marketData]
  );

  return (
    <Page title="Leaders Board">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography align="center" variant="h4">
          Top Deposits and Payouts.
        </Typography>
        <Typography className="text-lg mt-4 mb-8 text-center max-w-768 mx-auto">
          Discover seamless financial transactions with Us, checkout our Top
          Deposits and Withdrawals. Take control of your investments and
          earnings effortlessly.
        </Typography>
        <div className=" border-2 max-w-768 border-black rounded-full p-1 flex justify-between mx-auto mb-6">
          <button
            className={`px-6 py-4 ${
              order === 'deposit'
                ? 'bg-blue-500 text-white'
                : '!text-black !bg-none'
            }   text-base font-medium rounded-full`}
            onClick={() => setOrder('deposit')}
          >
            Deposit
          </button>
          <button
            className={`px-6 py-4 ${
              order === 'withdrawal'
                ? 'bg-blue-500 text-white'
                : '!text-black !bg-none'
            }   text-base font-medium rounded-full`}
            onClick={() => setOrder('withdrawal')}
          >
            Payouts
          </button>
        </div>

        {Object.keys(coinMap).length > 0 && (
          <LeadersTable
            row={order === 'deposit' ? investments : withdrawals}
            order={order}
            coinMap={coinMap}
            key={order}
          />
        )}
      </Container>
    </Page>
  );
}
