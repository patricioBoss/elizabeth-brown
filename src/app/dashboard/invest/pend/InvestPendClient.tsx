'use client';

import { Container, Typography, Grid } from '@mui/material';
import { useState } from 'react';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import PendingCards from '@/components/dashboard/PendingCards';

// ----------------------------------------------------------------------

interface User {
  _id: string;
  [key: string]: any;
}

interface InvestPendClientProps {
  user: User;
  pendingInvestments: any[];
  coinList: any;
}

// ----------------------------------------------------------------------

export default function InvestPendClient({ user, pendingInvestments, coinList }: InvestPendClientProps) {
  const { themeStretch } = useSettings();
  const [investments] = useState<any[]>(pendingInvestments);

  return (
    <Page title="Pending investment">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3">Pending Investment</Typography>
        <>
          <Grid container mt={3} spacing={3}>
            {!!investments.length &&
              investments.map((x) => (
                <Grid key={x._id} item xs={12} sm={6} md={4}>
                  <PendingCards
                    investment={x}
                    user={user}
                    coin={coinList![x.currency.toUpperCase()]}
                  />
                </Grid>
              ))}
          </Grid>
          {!investments.length && (
            <Typography textAlign={'center'} mt={4} color={'primary'} variant="h3">
              No Pending investments
            </Typography>
          )}
        </>
      </Container>
    </Page>
  );
}
