'use client';

import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Typography,
  TextField,
  Button,
  Card,
  Box,
  CardContent,
} from '@mui/material';
import { FaChevronLeft } from 'react-icons/fa';
import { capitalCase } from 'change-case';
import numeral from 'numeral';
// helpers
import stocks from '@/helpers/stocks';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(() => ({
  height: '100%',
  width: '100%',
  textAlign: 'left',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

interface Plan {
  minimum: number;
  maximum: number;
  name: string;
  id: number;
  interest: number;
}

interface StockData {
  symbol: string;
  longName: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
}

interface StockPlanCardsProps {
  plan: Plan;
  stockData: StockData;
  setDetails: (details: {
    capital: string;
    currency: string;
    stock: string;
    planId: number;
  }) => void;
  handleOpen: () => void;
}

// ----------------------------------------------------------------------

function StockPlanCards({
  plan: { minimum, maximum, name, id, interest },
  stockData,
  setDetails,
  handleOpen,
}: StockPlanCardsProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const handleToggle = () => setOpen((x) => !x);
  const handleAmtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(value);
  };
  const handleInvest = () => {
    setDetails({
      capital: amount,
      currency: 'usdt',
      stock: stockData.symbol,
      planId: id,
    });
    handleOpen();
  };
  return (
    <RootStyle>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4">{`${capitalCase(name)} Plan`}</Typography>
        <Box
          sx={{
            display: 'flex',
            marginTop: '1.5rem',
            alignItems: 'center',
          }}
        >
          <Box>
            <img
              style={{
                width: 38,
                height: 38,
              }}
              src={(stocks as Record<string, any>)[stockData.symbol]?.imgUrl ?? ''}
              className=" rounded-full"
              alt="stock icon"
            />
          </Box>
          <Typography paddingLeft={2} align={'center'} variant="h6">
            {`${stockData.longName} (USD)(1D)`}
          </Typography>
        </Box>
        <Box>
          <Typography
            marginTop={3}
            color={(theme) => theme.palette.primary.main}
            variant="body2"
          >
            Daily Bonus
          </Typography>
          <Typography variant="h5">{`${numeral(interest).format('0.00')}%`}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              marginTop={3}
              color={(theme) => theme.palette.primary.main}
              variant="body2"
            >
              Minimum Deposit
            </Typography>
            <Typography variant="subtitle2">{`${numeral(minimum).format('0,0.00')}USD`}</Typography>
          </Box>

          <Box>
            <Typography
              marginTop={3}
              color={(theme) => theme.palette.primary.main}
              variant="body2"
            >
              Maximum Deposit
            </Typography>
            <Typography variant="subtitle2">{`${numeral(maximum).format('0,0.00')}USD`}</Typography>
          </Box>
        </Box>
        <Box marginTop={3}>
          <Button
            sx={{
              boxShadow: 'none',
              ...(open ? { margin: '0 auto', display: 'block' } : {}),
              '.MuiButton-startIcon': {
                margin: 0,
                svg: {
                  margin: 0,
                },
              },
            }}
            fullWidth={!open}
            size="medium"
            variant={open ? 'outlined' : 'contained'}
            onClick={handleToggle}
            startIcon={open && <FaChevronLeft />}
          >
            {!open && 'Invest'}
          </Button>
          {open && (
            <>
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                size="small"
                variant="outlined"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={handleAmtChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button
                fullWidth
                size="medium"
                sx={{ mt: 3 }}
                type="button"
                variant="contained"
                onClick={handleInvest}
                disabled={
                  !(parseInt(amount) >= minimum && parseInt(amount) <= maximum)
                }
              >
                Proceed
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </RootStyle>
  );
}

export default StockPlanCards;
