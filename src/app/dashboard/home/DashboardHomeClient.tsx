'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Box, Button, Container, Grid, Modal, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import useSettings from '@/hooks/useSettings';
import Page from '@/components/page';
import AppWelcome from '@/sections/dashboard/app/AppWelcome';
import CustomAccountSummary from '@/sections/dashboard/app/CustomAccountSummary';
import StocksCarousel from '@/components/stocksCarousel/StocksCarousel';
import RealEstateBanner from '@/components/RealEstateBanner/RealEstateBanner';
import PortfolioTable from '@/components/PortfolioTable';
import { fCurrency } from '@/utils/formatNumber';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    md: 400,
  },
  bgcolor: 'background.paper',
  border: '1px solid #cdcdcd',
  borderRadius: '.8rem',
  boxShadow: 24,
};

// ----------------------------------------------------------------------

interface DashboardHomeClientProps {
  user: any;
  stocksData: any[];
  withdrawalList: any[];
  totalWithdrawal: number;
  totalEarnings: number;
  totalInvestment: number;
}

export default function DashboardHomeClient({
  user,
  stocksData,
  withdrawalList,
  totalWithdrawal,
  totalEarnings,
  totalInvestment,
}: DashboardHomeClientProps) {
  const { themeStretch } = useSettings();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleReInvest = () => {
    setLoading(true);
    axios
      .post(`/api/user/${user._id}/invest/reinvest`, {
        capital: user.accountBalance,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        router.push('/dashboard/invest/all');
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      });
  };

  const handleClose = () => setOpen(false);
  const totalBalance = user.accountBalance + totalInvestment;

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome displayName={user?.firstName} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StocksCarousel stocks={stocksData} />
          </Grid>

          <Grid item xs={12} md={12}>
            <RealEstateBanner />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAccountSummary
              reinvest={() => setOpen(true)}
              title="Total Active Balance"
              icon="eva:diagonal-arrow-left-down-fill"
              color="info"
              percent={user.accountBalance > 0 ? 0.1 : 0.0}
              total={totalBalance}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAccountSummary
              title="Total Withdrawal"
              icon="eva:diagonal-arrow-right-up-fill"
              color="warning"
              percent={user.accountBalance > 0 ? 0.1 : 0.0}
              total={totalWithdrawal}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAccountSummary
              title="Total Earnings"
              percent={user.accountBalance > 0 ? 0.1 : 0.0}
              icon="eva:diagonal-arrow-left-down-fill"
              total={totalEarnings}
              color="secondary"
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <PortfolioTable row={stocksData.slice(0, 5)} />
          </Grid>
        </Grid>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              sx={{ mt: 2, px: 4, pb: 1, borderBottom: '1px solid #cacaca' }}
              variant="h6"
              component="h2"
            >
              Top Up Investment
            </Typography>
            {user.accountBalance > 0 ? (
              <Typography id="modal-modal-description" sx={{ mt: 2, px: 4 }}>
                Glad you choose to take this step, You are about to Re-invest
                your current withdrawable balance which is{' '}
                <Typography component="span" sx={{ fontWeight: 600 }}>
                  {fCurrency(user.accountBalance)}
                </Typography>
                .
              </Typography>
            ) : (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, px: 4, pb: 2 }}
              >
                Glad you choose to take this step but your current balance is
                not high enough to re-invest, try again later when your balance
                is up to it.
              </Typography>
            )}
            <Box
              className="flex justify-end"
              sx={{ mt: 2, px: 4, py: 2, borderTop: '1px solid #cacaca' }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                color="error"
                sx={{ mx: 2 }}
              >
                Close
              </Button>
              {user.accountBalance > 0 && (
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  onClick={handleReInvest}
                >
                  Accept
                </LoadingButton>
              )}
            </Box>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
