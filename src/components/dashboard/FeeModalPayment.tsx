'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  InputAdornment,
  MenuItem,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import CopyClipboard from './CopyClipboard';

// ----------------------------------------------------------------------

const Img = styled('img')(({ theme }) => ({
  width: '350px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const Zone = styled('div')(({ theme }) => ({
  width: '500px',
  backgroundColor: theme.palette.grey[200],
  border: '.15rem dashed #8c9196',
  borderRadius: '.625rem',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
}

interface FeeModalPaymentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: UserData;
  url?: string;
}

interface FeeDetails {
  coin: string;
  amount: string;
  reason: string;
  transactionId: string;
}

// ----------------------------------------------------------------------

export default function FeeModalPayment({ open, setOpen, user }: FeeModalPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<FeeDetails>({
    coin: 'btc',
    amount: '',
    reason: 'Activation',
    transactionId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const isValid = Object.keys(details).every((field) => {
      return details[field as keyof FeeDetails].trim();
    });
    if (!isValid) {
      toast.error('fill all inputs');
      return;
    }
    setLoading(true);
    axios
      .post(`/api/user/${user._id}/deposit`, details)
      .then((res) => {
        setDetails({
          coin: 'btc',
          amount: '',
          reason: 'Activation',
          transactionId: '',
        });
        setOpen(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[1201]" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[36rem] sm:p-6">
                <div className="w-full flex flex-col justify-center items-center text-center">
                  <Typography mb={1} variant="h3">
                    {' '}
                    Fee Payment
                  </Typography>
                  <Typography sx={{ px: 4 }} variant="body1">
                    {' '}
                    Make payment for fees and additional charges to enhance your
                    account.
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      px: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      select
                      sx={{ mt: 2 }}
                      size="small"
                      value={details.coin}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img
                              style={{
                                width: 24,
                                height: 24,
                              }}
                              src={`/icons/${details.coin}.svg`}
                              alt="coin icon"
                            />
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleChange}
                      name="coin"
                      variant="outlined"
                      placeholder={'Enter wallet address'}
                    >
                      {[
                        { value: 'btc', label: 'Bitcoin(BTC)' },
                        { value: 'usdt', label: 'Tether(USDT)' },
                        { value: 'eth', label: 'Etherum(ETH)' },
                        { value: 'doge', label: 'Dogecoin(DOGE)' },
                        { value: 'xrp', label: 'XRP (XRP)' },
                      ].map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      select
                      sx={{ mt: 2 }}
                      size="small"
                      value={details.reason}
                      onChange={handleChange}
                      name="reason"
                      variant="outlined"
                      placeholder={'Select Procedure'}
                    >
                      {[
                        { value: 'Activation', label: 'Activation' },
                        { value: 'Upgrade', label: 'Upgrade' },
                        {
                          value: 'Capital Increase',
                          label: 'Capital Increase',
                        },
                      ].map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box
                      sx={{
                        width: '100%',
                        py: 3,
                      }}
                    >
                      <>
                        <Typography
                          align="center"
                          variant="body2"
                          color={'primary'}
                        >
                          Wallet Address
                        </Typography>
                        {details.coin === 'btc' && (
                          <CopyClipboard
                            value={'bc1qpym28gpuhtzsr55vs6ym0suex4pn0nxc20zq7v'}
                            size="small"
                            disabled
                          />
                        )}
                        {details.coin === 'usdt' && (
                          <CopyClipboard
                            value={'0x7ac61Ed4A0C5422e8EfeA284375b5B8ec981B56A'}
                            size="small"
                            disabled
                          />
                        )}
                        {details.coin === 'eth' && (
                          <CopyClipboard
                            value={'0xb2C680e57B66262116828B8547856Dd45E55ba8F'}
                            size="small"
                            disabled
                          />
                        )}
                        {details.coin === 'doge' && (
                          <CopyClipboard
                            value={'DRZUBekWEywdDAeAhy2fGVKi4RsJbKra4q'}
                            size="small"
                            disabled
                          />
                        )}
                        {details.coin === 'xrp' && (
                          <CopyClipboard
                            value={'rJrwju5oxgBbkRoWHkD9U9cjqkWLcC3Ttg'}
                            size="small"
                            disabled
                          />
                        )}
                        <TextField
                          fullWidth
                          sx={{ mt: 2 }}
                          size="small"
                          name="amount"
                          variant="outlined"
                          placeholder="Amount"
                          type="number"
                          value={details.amount}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextField
                          fullWidth
                          sx={{ mt: 2 }}
                          size="small"
                          name="transactionId"
                          variant="outlined"
                          placeholder="Enter transaction Id"
                          type="text"
                          value={details.transactionId}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      px: 2,
                    }}
                  >
                    <LoadingButton
                      sx={{ mt: 2 }}
                      loading={loading}
                      onClick={handleSubmit}
                      fullWidth
                      variant="contained"
                      size="large"
                    >
                      <span>submit </span>
                    </LoadingButton>
                  </Box>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
