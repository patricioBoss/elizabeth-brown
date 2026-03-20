'use client';

import { Container, Typography, Modal, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import { capitalCase } from 'change-case';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import InvestmentTable, { InvestmentRow } from '@/components/dashboard/InvestmentTable';
import { fCurrency } from '@/utils/formatNumber';
import plans from '@/helpers/plans';

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

interface User {
  _id: string;
  accountBalance: number;
  [key: string]: any;
}

interface InvestAllClientProps {
  user: User;
  allInvestments: InvestmentRow[];
}

const getNextPlan = (totalTopUp: number) => {
  let highPlan = plans.reduce((acc: number, plan, index: number) => {
    if (plan.minimum > totalTopUp && plans[acc].minimum <= totalTopUp) {
      acc = index;
    }
    return acc;
  }, 0);

  return plans[highPlan === 0 ? 0 : highPlan - 1];
};

// ----------------------------------------------------------------------

export default function InvestAllClient({ user, allInvestments }: InvestAllClientProps) {
  const { themeStretch } = useSettings();
  const [open, setOpen] = useState(false);
  const [investments, setInvestments] = useState<InvestmentRow[]>(allInvestments);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [topUpIvt, setTopUpIvt] = useState<Partial<InvestmentRow & { capital: number }>>({});

  const handleOpen = (investment: InvestmentRow) => {
    setTopUpIvt(investment);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleTopUp = () => {
    setLoading(true);
    axios
      .put(`/api/user/${user._id}/invest/${topUpIvt._id}/topup`, {
        amount: user.accountBalance + (topUpIvt as any).capital,
      })
      .then((res) => {
        setLoading(false);
        setUpdate((x) => !x);
        toast.success(res.data.message);
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

  const RefetchData = async () => {
    try {
      const res = await axios.get(`/api/user/${user._id}/invest/all`);
      const fetchedInvestments = res.data.data ?? res.data;

      // Build unique stock string for API call
      const uniqueStockString = Array.from(
        new Set(
          fetchedInvestments.map((x: any) =>
            x.stock === 'usdt' || x.stock === 'btc'
              ? `${x.stock.toUpperCase()}-USD`
              : x.stock.toUpperCase()
          )
        )
      ).join(',');
      
      // Fetch stock market data
      const stocksResponse = await axios({
        baseURL: process.env.NEXT_PUBLIC_IMAGE_SERVER,
        method: 'GET',
        url: '/yahooapi/quotes',
        params: {
          symbols: uniqueStockString ? uniqueStockString : 'NONE',
        },
      });
      
      const stocksDataList = await stocksResponse.data.data;
      const stocksDataMap = stocksDataList.reduce((acc: any, stock: any) => {
        acc[stock.symbol] = stock;
        return acc;
      }, {});
      
      // Map investments with stock data
      const investmentsWithStockData = fetchedInvestments.map((x: any) => ({
        ...x,
        stock:
          stocksDataMap[
            x.stock === 'usdt' || x.stock === 'btc'
              ? `${x.stock.toUpperCase()}-USD`
              : x.stock.toUpperCase()
          ],
      }));
      
      setInvestments(investmentsWithStockData);
      setLoading(false);
      toast.success(res.data.message);
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        toast.error('error, pls try again');
      } else {
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    if (update) {
      RefetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  return (
    <Page title="investment list">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <>
          <InvestmentTable rows={investments} handleConfirmShow={handleOpen} />
        </>
      </Container>
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
          {user && user.accountBalance > 0 ? (
            <Typography id="modal-modal-description" sx={{ mt: 2, px: 4 }}>
              Glad you choose to take this step, topping up your this active investment entails
              using your current balance to top up this active investment. You are investing a total
              of{' '}
              <Typography component={'span'} sx={{ fontWeight: 600 }}>
                {fCurrency(user.accountBalance + ((topUpIvt as any).capital ?? 0))}
              </Typography>{' '}
              upgrading this investment to &nbsp;
              <Typography component={'span'} sx={{ fontWeight: 600 }}>
                {capitalCase(
                  getNextPlan(user.accountBalance + ((topUpIvt as any).capital ?? 0))?.name ?? ''
                )}
                Plan.
              </Typography>
            </Typography>
          ) : (
            <Typography id="modal-modal-description" sx={{ mt: 2, px: 4, pb: 2 }}>
              Glad you choose to take this step but your current balance is not high enough to
              invest, try again later when your balance is up to it.
            </Typography>
          )}
          <Box
            className="flex justify-end"
            sx={{ mt: 2, px: 4, py: 2, borderTop: '1px solid #cacaca' }}
          >
            <Button variant="outlined" onClick={handleClose} color="error" sx={{ mx: 2 }}>
              Close
            </Button>
            {user && user.accountBalance > 0 && (
              <LoadingButton variant="contained" loading={loading} onClick={() => handleTopUp()}>
                <span> Accept</span>
              </LoadingButton>
            )}
          </Box>
        </Box>
      </Modal>
    </Page>
  );
}
