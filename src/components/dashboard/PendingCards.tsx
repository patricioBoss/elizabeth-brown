'use client';

import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Typography,
  TextField,
  Card,
  Box,
  CardContent,
  IconButton,
  Modal,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { MdDelete } from 'react-icons/md';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { capitalCase } from 'change-case';
import numeral from 'numeral';
import Image from 'next/image';
// paypal
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
// barcode images
import usdtImg from '@/assets/img/usdt.jpg';
import btcImg from '@/assets/img/btc.png';
import ethImg from '@/assets/img/eth.jpg';
import dogeImg from '@/assets/img/doge.jpg';
import xrpImg from '@/assets/img/xrp.jpg';
import Iconify from '@/components/iconify';
import Label from '@/components/label';
import CopyClipboard from '@/components/dashboard/CopyToClipboard';
import stocks from '@/helpers/stocks';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(() => ({
  height: '100%',
  width: '100%',
  textAlign: 'left',
  alignItems: 'center',
}));

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
  border: '2px solid #000',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

// ----------------------------------------------------------------------

interface StockData {
  symbol: string;
  longName?: string;
  displayName?: string;
  financialCurrency?: string;
}

interface Plan {
  name: string;
  [key: string]: any;
}

interface Investment {
  _id: string;
  plan: Plan;
  capital: number;
  currency: string;
  stock: StockData;
  type: string;
}

interface Coin {
  price_usd: number;
  asset_id: string;
}

interface User {
  _id: string;
  [key: string]: any;
}

interface PendingCardsProps {
  investment: Investment;
  user: User;
  coin: Coin;
}

// ----------------------------------------------------------------------

export default function PendingCards({ investment, user, coin }: PendingCardsProps) {
  const { _id, plan: { name }, capital, currency, stock, type } = investment;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [open, setOpen] = useState(false);
  const [orderID, setOrderID] = useState('');
  const router = useRouter();

  const handleAmtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionId(e.target.value);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createOrder = (_data: any, actions: any) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: `This sharedAsset ${stock.longName} of ${capital} capital`,
            amount: {
              currency_code: 'USD',
              value: capital,
            },
          },
        ],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((id: string) => {
        setOrderID(id);
        return id;
      });
  };

  const onApprove = (_data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      setIsSubmitting(true);
      axios
        .post(`/api/user/${user._id}/invest/${_id}`, { transactionId: orderID })
        .then(() => {
          toast.success('paypal transaction successful');
          router.push('/dashboard/invest/all');
          setIsSubmitting(false);
        })
        .catch((err) => {
          setIsSubmitting(false);
          if (err.response) {
            toast.error('error, submitting transaction');
          } else {
            toast.error(err.message);
          }
        });
    });
  };

  const onError = (_data: any) => {
    toast.error('An error occured with your payment');
  };

  const handleSubmit = () => {
    if (currency === 'usdt' && transactionId.length <= 5) {
      toast.error('invalid transactionId');
      return;
    }
    setIsSubmitting(true);
    axios
      .post(`/api/user/${user._id}/invest/${_id}`, { transactionId })
      .then(() => {
        router.push('/dashboard/invest/all');
        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
        if (err.response) {
          toast.error('error, submitting transaction');
        } else {
          toast.error(err.message);
        }
      });
  };

  const handleDelete = () => {
    setIsSubmitting(true);
    axios
      .delete(`/api/user/${user._id}/invest/${_id}`)
      .then(() => {
        setIsSubmitting(false);
        handleClose();
        router.push('/dashboard/portfolio');
      })
      .catch((err) => {
        setIsSubmitting(false);
        if (err.response) {
          toast.error('error, submitting transaction');
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <RootStyle>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Unpaid investment
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you wnt to delete this investment of deposit:{' '}
            {numeral(capital).format('0.00')} USD
          </Typography>
          <Stack mt={3} direction="row" spacing={3}>
            <LoadingButton
              size="medium"
              type="submit"
              variant="contained"
              color="error"
              loading={isSubmitting}
              onClick={handleDelete}
            >
              <span>Confirm </span>
            </LoadingButton>
            <Button size="medium" type="submit" variant="contained" color="warning" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      {currency === 'paypal' ? (
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <PayPalScriptProvider
            options={{
              'client-id':
                'AbMZbN6P1ac0qNp2yLOtbcuHpx8CPcenYL365uQuKfZes6_SlM4UOYb-6cMVJIb0oG1Ez3uj38Ht2YaU',
            }}
          >
            <Box
              mb={1}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <img
                    style={{ width: 30, height: 30 }}
                    className="rounded-full"
                    src={(stocks as any)[stock.symbol]?.imgUrl}
                    alt="stock icon"
                  />
                </Box>
                <Typography
                  paddingLeft={2}
                  align={'center'}
                  variant="subtitle2"
                  sx={{ color: 'text.secondary' }}
                >
                  {`${stock.displayName?.toUpperCase()}(${stock.financialCurrency})${capitalCase(name)} Plan`}
                </Typography>
              </Box>
              <Box sx={{ color: 'error.main', justifySelf: 'end' }}>
                <IconButton onClick={handleOpen}>
                  <MdDelete style={{ width: 24, height: 24 }} />
                </IconButton>
              </Box>
            </Box>
            <Stack>
              <div>
                <Typography variant="h4">PayPal Payment</Typography>
              </div>
            </Stack>
            <Stack spacing={2.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
                  Summary
                </Typography>
                <Label color="error" variant="filled">
                  PREMIUM
                </Label>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <Typography sx={{ color: 'text.secondary', pt: 1 }}>$</Typography>
                <Typography variant="h2">{capital}</Typography>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" component="p">
                  Total Billed
                </Typography>
                <Typography variant="h6" component="p">
                  ${numeral(capital).format('0.00')}*
                </Typography>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
            </Stack>

            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
              * Plus applicable taxes
            </Typography>

            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />

            <Stack alignItems="center" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Iconify
                  icon={'eva:shield-fill'}
                  sx={{ width: 20, height: 20, color: 'primary.main' }}
                />
                <Typography variant="subtitle2">Secure credit card payment</Typography>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', textAlign: 'center' }}
              >
                This is a secure 128-bit SSL encrypted payment
              </Typography>
            </Stack>
          </PayPalScriptProvider>
        </CardContent>
      ) : (
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <img
                  style={{ width: 24, height: 24 }}
                  src={`/icons/${currency}.svg`}
                  alt="coin icon"
                />
              </Box>
              <Typography paddingLeft={2} align={'center'} variant="subtitle2">
                {`${type.includes('stock') ? stock.displayName : 'Real Estate'}`}
                {` ${capitalCase(name)} Plan`}
              </Typography>
            </Box>
            <Box sx={{ color: 'error.main', justifySelf: 'end' }}>
              <IconButton onClick={handleOpen}>
                <MdDelete style={{ width: 24, height: 24 }} />
              </IconButton>
            </Box>
          </Box>

          <Typography align="center" variant="h5">{`Deposit: ${numeral(capital).format(
            '0.00'
          )} USD`}</Typography>
          <Typography align="center" variant="h6" color={'primary'}>{`Deposit: ${numeral(
            capital / coin.price_usd
          ).format('0.000000')} ${coin.asset_id}`}</Typography>

          <Typography align="center" variant="body2" color={'primary'}>
            Make payment to the Address below
          </Typography>
          <Box>
            {currency === 'btc' && <Image src={btcImg} alt="barcode" />}
            {currency === 'usdt' && <Image src={usdtImg} alt="barcode" />}
            {currency === 'eth' && <Image src={ethImg} alt="barcode" />}
            {currency === 'doge' && <Image src={dogeImg} alt="barcode" />}
            {currency === 'xrp' && <Image src={xrpImg} alt="barcode" />}
          </Box>
          <Box>
            <>
              <Typography align="center" variant="body2" color={'primary'}>
                Wallet Address
              </Typography>
              {currency === 'btc' && (
                <CopyClipboard value={'bc1qn0aypfecwukuvx654cjynmlzvvuq2xasg9w23f'} size="small" disabled />
              )}
              {currency === 'usdt' && (
                <CopyClipboard value={'0x7ac61Ed4A0C5422e8EfeA284375b5B8ec981B56A'} size="small" disabled />
              )}
              {currency === 'eth' && (
                <CopyClipboard value={'0xb2C680e57B66262116828B8547856Dd45E55ba8F'} size="small" disabled />
              )}
              {currency === 'doge' && (
                <CopyClipboard value={'DRZUBekWEywdDAeAhy2fGVKi4RsJbKra4q'} size="small" disabled />
              )}
              {currency === 'xrp' && (
                <CopyClipboard value={'ra233tNe3RPmo9AQ9s4QW8bSy6Ppd7SgZc'} size="small" disabled />
              )}
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                size="small"
                variant="outlined"
                placeholder="Enter transaction Id"
                type="text"
                value={transactionId}
                onChange={handleAmtChange}
                InputLabelProps={{ shrink: true }}
              />
              <LoadingButton
                fullWidth
                size="medium"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                <span> Confirm Payment</span>
              </LoadingButton>
            </>
          </Box>
        </CardContent>
      )}
    </RootStyle>
  );
}
