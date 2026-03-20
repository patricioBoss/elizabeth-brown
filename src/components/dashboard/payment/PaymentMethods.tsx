'use client';

import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Paper,
  Radio,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
// components
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS = [
  {
    value: 'usdt',
    title: 'Pay with USDT',
    icons: [
      'https://pipsville-bucket.s3.us-west-004.backblazeb2.com/usdt-sm0.svg',
    ],
  },
  {
    value: 'btc',
    title: 'Pay with Bitcoin',
    icons: [
      'https://pipsville-bucket.s3.us-west-004.backblazeb2.com/btc-sm0.svg',
    ],
  },
  {
    value: 'eth',
    title: 'Pay with Ethereum',
    icons: [
      'https://f004.backblazeb2.com/file/pipsville-bucket/eth-sm0-svg.svg',
    ],
  },
  {
    value: 'xrp',
    title: 'Pay with XRP',
    icons: [
      'https://pipsville-bucket.s3.us-west-004.backblazeb2.com/xrp-sm0-svg.svg',
    ],
  },
  {
    value: 'eth',
    title: 'Pay with DodgeCoin',
    icons: [
      'https://pipsville-bucket.s3.us-west-004.backblazeb2.com/doge-sm0-svg.png',
    ],
  },
];

const OptionStyle = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2),
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

interface PaymentDetails {
  capital: string;
  currency: string;
  stock: string;
  planId: number;
}

interface User {
  _id: string;
  [key: string]: unknown;
}

interface PaymentMethodsProps {
  details: PaymentDetails;
  user: User;
}

// ----------------------------------------------------------------------

export default function PaymentMethods({ details, user }: PaymentMethodsProps) {
  const [method, setMethod] = useState(details.currency);
  const [isSubmitting, setisSubmitting] = useState(false);
  const router = useRouter();

  const handleChangeMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value);
  };

  const handleInvest = () => {
    setisSubmitting(true);
    axios
      .post(`/api/user/${user._id}/invest`, {
        ...details,
        currency: method,
      })
      .then(() => {
        router.push('/dashboard/invest/pend');
        setisSubmitting(false);
      })
      .catch((err) => {
        setisSubmitting(false);
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <div className="w-full max-w-full">
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Payment Method
      </Typography>
      <Typography variant="body2" align="left" sx={{ mb: 2 }}>
        select valid payment method below.
      </Typography>

      <RadioGroup value={method} onChange={handleChangeMethod}>
        <Stack spacing={3}>
          {PAYMENT_OPTIONS.map((option) => {
            const { value, title, icons } = option;
            const isSelected = method === value;
            return (
              <OptionStyle
                key={title}
                sx={{
                  ...(isSelected && {
                    boxShadow: (theme) => (theme as any).customShadows?.z20,
                  }),
                }}
              >
                <FormControlLabel
                  value={value}
                  control={
                    <Radio
                      checkedIcon={
                        <Iconify icon={'eva:checkmark-circle-2-fill'} />
                      }
                    />
                  }
                  label={
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      {title}
                    </Typography>
                  }
                  sx={{
                    py: {
                      sm: 2,
                      md: 3,
                    },
                    mx: 0,
                  }}
                />

                <Stack
                  spacing={1}
                  direction="row"
                  alignItems="center"
                  sx={{ right: 20, top: 32 }}
                >
                  {icons.map((icon) => (
                    <Image
                      key={icon}
                      width={38}
                      height={38}
                      alt="logo card"
                      src={icon}
                    />
                  ))}
                </Stack>
              </OptionStyle>
            );
          })}
        </Stack>
      </RadioGroup>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        onClick={handleInvest}
        sx={{ mt: 3, mb: 2 }}
      >
        <span> Pay Now</span>
      </LoadingButton>
    </div>
  );
}
