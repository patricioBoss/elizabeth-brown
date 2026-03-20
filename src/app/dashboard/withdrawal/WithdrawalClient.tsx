'use client';

import { Container, Typography, Grid } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { differenceInDays } from 'date-fns';
// hooks
import useSettings from '@/hooks/useSettings';
// utils
import { fCurrency } from '@/utils/formatNumber';
// components
import Page from '@/components/page';
import WithDrawCard from '@/components/dashboard/WithDrawCard';
import WithdrawalTable from '@/components/dashboard/WithdrawalTable';

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
  firstName?: string;
  accountBalance?: number;
  withdrawalVested?: string;
}

interface WithdrawalRecord {
  _id: string;
  currency: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface WithdrawalClientProps {
  user: UserData;
  withdrawalList: WithdrawalRecord[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// ----------------------------------------------------------------------

export default function WithdrawalClient({ user: initialUser, withdrawalList }: WithdrawalClientProps) {
  const { themeStretch } = useSettings();
  const [_withdrawalList] = useState<WithdrawalRecord[]>(withdrawalList);

  const url = `/api/user/${initialUser._id}`;
  const { data } = useSWR<UserData>(url, fetcher);

  const currentUser = data ? data : initialUser;

  const getDateDiff = () =>
    differenceInDays(new Date(currentUser?.withdrawalVested || ''), new Date());

  return (
    <Page title="wallet">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Withdrawal/Pay wall</Typography>
        {currentUser?.withdrawalVested &&
        new Date(currentUser?.withdrawalVested) > new Date() ? (
          <Typography variant="body2" mb={3}>
            Dear {currentUser?.firstName}, your investment on our platform is now
            vested. You will be eligible to make a withdrawal in&nbsp;
            <Typography component={'span'} sx={{ fontWeight: 700 }}>
              {getDateDiff()} days
            </Typography>
            . Please feel free to monitor your panel for further updates. Note,
            you cannot withdraw more than your account balance.
          </Typography>
        ) : (
          <Typography variant="body2" mb={3}>
            You currently have a withdrawable balance of{' '}
            <Typography component={'span'} sx={{ fontWeight: 700 }}>
              {fCurrency(currentUser.accountBalance || 0)}
            </Typography>
            . Note, you cannot withdraw more than your account balance.
          </Typography>
        )}
        <Typography variant="body2" mb={1}>
          Last Updated:
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <WithDrawCard
              user={currentUser}
              disabled={
                !!(currentUser?.withdrawalVested &&
                new Date(currentUser?.withdrawalVested) > new Date())
              }
              url={url}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <WithdrawalTable row={_withdrawalList} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
