'use client';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Container, Typography } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Page from 'src/components/page';
import Logo from 'src/components/logo';
import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
// sections
import RegisterForm from 'src/sections/auth/register-form';
import { useEffect, useRef } from 'react';
import { useRouter } from '@bprogress/next';
import axios from 'axios';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

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

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const mounted = useRef(true);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get('ref');

    if (mounted.current && ref) {
      axios
        .get('/api/user/' + ref)
        .then((res) => {
          console.log(res.data.data);
          localStorage.setItem('ref', JSON.stringify(res.data.data));
        })
        .catch((err) => {
          console.error(err);
        });
    }
    mounted.current = false;
  }, []);

  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <Logo size="small" type="full" />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Already have an account?{' '}
              <NextLink href="/login" passHref legacyBehavior>
                <MuiLink variant="subtitle2" component="span">
                  Login
                </MuiLink>
              </NextLink>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography
              variant="h3"
              sx={{
                px: 5,
                mt: 10,
                mb: 5,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Create a Free Account with us
            </Typography>
            <Box
              component="img"
              src="/img/signupIllustration-svg.svg"
              alt="register"
              sx={{ width: '100%' }}
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Get started absolutely free.
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Free forever. No credit card needed.
                </Typography>
              </Box>
            </Box>

            <RegisterForm />

            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mt: 3 }}
            >
              By registering, You agree to Our&nbsp;
              <br />
              <NextLink href="/" passHref legacyBehavior>
                <MuiLink underline="always" color="primary">
                  Terms of Service&nbsp;
                </MuiLink>
              </NextLink>
              and
              <NextLink href="/" passHref legacyBehavior>
                <MuiLink underline="always" color="primary">
                  &nbsp;Privacy Policy
                </MuiLink>
              </NextLink>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Already have an account?{' '}
                <NextLink href="/login" passHref legacyBehavior>
                  <MuiLink>
                    Login
                  </MuiLink>
                </NextLink>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
