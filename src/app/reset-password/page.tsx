'use client';

import React from 'react';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
import { Stack, Typography, Container, TextField } from '@mui/material';
import { HiChevronLeft } from 'react-icons/hi';
import Link from 'next/link';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useFormik, Form, FormikProvider } from 'formik';
import useResponsive from '@/hooks/useResponsive';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

// ----------------------------------------------------------------------

const ResetPasswordPage: React.FC = () => {
  const smUp = useResponsive('up', 'sm');

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .trim()
      .lowercase()
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) =>
      axios
        .post('/api/auth/reset-password', values)
        .then((res) => {
          toast.success(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.message);
          }
        }),
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <HeaderStyle>
        <div />
        {smUp && (
          <Typography variant="body2" sx={{ mt: { md: -2 } }}>
            <a
              rel="noreferrer"
              href="#"
              style={{ cursor: 'pointer' }}
            >
              Need Help?
            </a>
          </Typography>
        )}
      </HeaderStyle>
      
      <Container maxWidth="sm">
        <Stack
          spacing={2}
          sx={{ minHeight: '100vh', justifyContent: 'center' }}
        >
          <img
            src={'/assets/images/lock.png'}
            style={{ width: 50, alignSelf: 'center' }}
            alt="lock illustration"
          />

          <Typography variant="h3" align="center" gutterBottom>
            Forgot your password?
          </Typography>
          <Typography align="center" sx={{ color: 'text.secondary', mb: 15 }}>
            {' '}
            Please enter the email address associated with your account and We
            will email you a link to reset your password.
          </Typography>
          
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  autoComplete="username"
                  type="email"
                  label="Email address"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  <span>Send Request </span>
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>

          <Link href={'/login'} style={{ width: '100%' }}>
            <Typography
              color={'#000'}
              className="cursor-pointer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              {' '}
              <HiChevronLeft /> Return to login
            </Typography>
          </Link>
        </Stack>
      </Container>
    </>
  );
};

export default ResetPasswordPage;
