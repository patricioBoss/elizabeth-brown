'use client';

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Typography,
  TextField,
  MenuItem,
  Card,
  Box,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(() => ({
  height: '100%',
  width: '100%',
  textAlign: 'left',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
  accountBalance?: number | string;
}

interface WithDrawCardProps {
  user: UserData;
  url?: string;
  disabled?: boolean;
}

interface WithdrawalDetails {
  currency: string;
  amount: string;
}

// ----------------------------------------------------------------------

function WithDrawCard({ user, url, disabled }: WithDrawCardProps) {
  const [details, setDetails] = useState<WithdrawalDetails>({
    currency: 'usdt',
    amount: '',
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleError = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { value, name } = target;
    if (value && name === 'amount') {
      if (Number(value) > Number(user.accountBalance)) {
        toast.error('cannot withdraw more than active balance');
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setError(false);
    }
  };

  const makeWithdrawal = () => {
    if (error) return;
    if (Number(details.amount) > Number(user.accountBalance)) {
      toast.error('cannot withdraw more than active balance');
      return;
    }
    setLoading(true);
    axios
      .post(`/api/user/${user._id}/withdraw`, details)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <>
      {' '}
      <RootStyle>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', marginTop: '.5rem' }}>
                  <Typography
                    paddingLeft={2}
                    align={'center'}
                    variant="subtitle2"
                  >
                    Select wallet
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  select
                  sx={{ mt: 2 }}
                  size="small"
                  value={details.currency}
                  onChange={handleChange}
                  name="currency"
                  variant="outlined"
                  placeholder={'Enter wallet address'}
                >
                  {[
                    { value: 'usdt', label: 'Tether(USDT)' },
                    { value: 'btc', label: 'Bitcoin(BTC)' },
                    { value: 'eth', label: 'Etherum(ETH)' },
                  ].map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box>
                <Box sx={{ display: 'flex', marginTop: '.5rem' }}>
                  <Typography
                    paddingLeft={2}
                    align={'center'}
                    variant="subtitle2"
                  >
                    Enter Amount
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  sx={{ mt: 2 }}
                  size="small"
                  value={details.amount}
                  type="number"
                  name="amount"
                  onChange={handleChange}
                  variant="outlined"
                  onKeyUp={handleError}
                  placeholder={'Enter Amount'}
                  error={error}
                  helperText={
                    error && 'amount must not be greater than account balance'
                  }
                />
              </Box>
            </Grid>
            <Stack p={4} alignItems={'center'} direction={'row'}>
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={loading}
                disabled={error || disabled}
                onClick={makeWithdrawal}
              >
                <span> initiate withdrawal </span>
              </LoadingButton>
            </Stack>
          </Grid>
        </CardContent>
      </RootStyle>
    </>
  );
}

export default WithDrawCard;
