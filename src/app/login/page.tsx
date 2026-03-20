'use client';

// @mui
import { styled } from '@mui/material/styles';
import { Card, Container, Typography, Box, Link } from '@mui/material';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// components
import Page from 'src/components/page';
import Logo from 'src/components/logo';
// sections
import LoginForm from 'src/sections/auth/login-form';

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
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo size="small" type="full" />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {"Don't have an account? "}
              <NextLink href="/register" className="cursor-pointer" passHref legacyBehavior>
                <Link underline="hover" color="primary">
                  Get started
                </Link>
              </NextLink>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography
              variant="h3"
              sx={[
                { px: 5, mt: 12, mb: 2, width: 350 },
                (theme) => ({
                  color: theme.palette.primary.main,
                }),
              ]}
            >
              Hi, Welcome Back.
            </Typography>
            <Box
              component="img"
              src="/img/login-illustration.svg"
              alt="login illustration"
              sx={{ width: '100%' }}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 10 }}>
              Enter your details below.
            </Typography>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                {"Don't have an account? "}
                <NextLink href="/register" passHref legacyBehavior>
                  <MuiLink>Get started</MuiLink>
                </NextLink>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
