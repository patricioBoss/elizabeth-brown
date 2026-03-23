'use client';

import { useState } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import useSWR from 'swr';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import StockPlanCards from '@/components/dashboard/StockPlanCards';
import PaymentChoice from '@/components/dashboard/PaymentChoice';
// helpers
import stocks from '@/helpers/stocks';
import plans from '@/helpers/plans';
// fetchers
import { getUserById } from '@/helpers/fetchers';

// ----------------------------------------------------------------------

interface StockData {
  symbol: string;
  longName: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
}

interface User {
  _id: string;
  [key: string]: unknown;
}

interface PayDetails {
  capital: string;
  currency: string;
  stock: string;
  planId: number;
}

interface Props {
  user: User;
  stockData: StockData | null;
  quoteData: any;
}

// ----------------------------------------------------------------------

export default function PortfolioStockClient({ user, stockData, quoteData }: Props) {
  const { themeStretch } = useSettings();
  const url = `/api/user/${user._id}`;
  const [open, setOpen] = useState(false);
  const [payDetails, setPayDetails] = useState<PayDetails>({
    capital: '',
    currency: '',
    stock: '',
    planId: 0,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const { data } = useSWR(url, getUserById);

  // Show loading state if stockData is not available
  if (!stockData || !stockData.symbol) {
    return (
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  const stockConfig = (stocks as Record<string, any>)[stockData.symbol];

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">
          Invest in{' '}
          <span
            style={{ background: stockConfig?.bg || '#3182c1' }}
            className=" text-white p-2 rounded-md"
          >
            {stockData.longName || stockData.shortName || stockData.symbol}
          </span>
        </Typography>
        <Grid mt={1} container spacing={3}>
          {plans.map((plan, index) => (
            <Grid key={plan.id} item xs={12} sm={6} md={4}>
              <StockPlanCards
                setDetails={setPayDetails}
                plan={{ ...plan, id: index }}
                handleOpen={handleOpen}
                stockData={stockData}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <PaymentChoice open={open} setOpen={setOpen} details={payDetails} user={data ?? user} />
    </>
  );
}
