'use client';

import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Input, Divider, IconButton, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '@/components/iconify';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as yup from 'yup';
import dynamic from 'next/dynamic';

// ----------------------------------------------------------------------

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        bgcolor: 'background.paper',
      }}
    >
      Loading...
    </Box>
  ),
});

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 1999,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  margin: theme.spacing(3),
  boxShadow: (theme as any).customShadows?.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.paper,
}));

const InputStyle = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.5, 3),
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

export default function MailCompose() {
  const [fullScreen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [values, setvalues] = useState({
    email: '',
    subject: '',
  });
  const [message, setMessage] = useState('');

  const handleChangeMessage = (value: string) => {
    setMessage(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setvalues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = () => {
    const mailDetails = { ...values, message };
    let schema = yup.object().shape({
      email: yup.string().email('email must be valid').required(),
      subject: yup.string(),
      message: yup.string().required(),
    });

    schema
      .validate(mailDetails)
      .then(function (valid) {
        setLoading(true);
        mailDetails.email.toLowerCase();
        axios
          .post('/api/sendmail', mailDetails)
          .then(() => {
            setLoading(false);
            toast.success('message sent');
          })
          .catch((err) => {
            setLoading(false);
            if (err.response) {
              toast.error(err.response.data.message);
            } else {
              toast.error(err.message);
            }
          });
      })
      .catch((err) => {
        console.log(err);
        toast.error('email is not valid');
      });
  };

  return (
    <RootStyle
      sx={{
        ...(fullScreen && {
          top: 0,
          left: 0,
          zIndex: 1999,
          margin: 'auto',
          width: {
            xs: `calc(100% - 24px)`,
            md: `calc(100% - 80px)`,
          },
          height: {
            xs: `calc(100% - 24px)`,
            md: `calc(100% - 80px)`,
          },
        }),
      }}
    >
      <Box
        sx={{
          pl: 3,
          pr: 1,
          height: 60,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">New Message</Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Box>

      <Divider />

      <InputStyle
        disableUnderline
        placeholder="To"
        name="email"
        value={values.email}
        onChange={handleChange}
      />

      <InputStyle
        disableUnderline
        placeholder="Subject"
        name="subject"
        value={values.subject}
        onChange={handleChange}
      />

      <ReactQuill
        value={message}
        onChange={handleChangeMessage}
        placeholder="Type a message"
        style={{
          flexGrow: 1,
          borderColor: 'transparent',
        }}
      />

      <Divider />

      <Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
        >
          <span> Send</span>
        </LoadingButton>
        <IconButton size="small" sx={{ ml: 2, mr: 1 }}>
          <Iconify
            icon={'ic:round-add-photo-alternate'}
            width={24}
            height={24}
          />
        </IconButton>

        <IconButton size="small">
          <Iconify icon={'eva:attach-2-fill'} width={24} height={24} />
        </IconButton>
      </Box>
    </RootStyle>
  );
}
