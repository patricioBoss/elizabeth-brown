'use client';

import { useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import StocksCard from '@/components/dashboard/StocksCard';

// ----------------------------------------------------------------------

interface StockDataItem {
  data: {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    longName?: string;
  };
  quote: {
    open: number[];
  };
}

interface Props {
  stockDataQuote: StockDataItem[];
}

// ----------------------------------------------------------------------

export default function PortfolioClient({ stockDataQuote }: Props) {
  const { themeStretch } = useSettings();
  const [stockList] = useState(stockDataQuote);

  return (
    <Page title="All Plans">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Explore Trending Markets</Typography>
        <Grid mt={1} container spacing={3}>
          {stockList.map((stock) => (
            <Grid key={stock.data.symbol} item xs={12} sm={6} md={4}>
              <StocksCard stockData={stock.data} chartData={stock.quote.open} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
