'use client';

import React from 'react';
import { useRouter } from 'src/routes/hook';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Button, Card, CardContent, Box } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
  },
}));

const MyImage = styled('img')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const MyImage2 = styled('img')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
    width: '90%',
  },
}));

// ----------------------------------------------------------------------

interface AppWelcomeProps {
  displayName?: string;
}

export default function AppWelcome({ displayName }: AppWelcomeProps) {
  const router = useRouter();

  return (
    <RootStyle>
      <CardContent
        className="flex-1"
        sx={{
          p: { md: 0 },
          pl: { md: 5 },
          color: 'grey.800',
        }}
      >
        <Typography gutterBottom variant="h4">
          Welcome ,
          <br /> {!displayName ? '...' : displayName}!
        </Typography>

        <Typography
          variant="body2"
          sx={{ pb: { xs: 3, xl: 3 }, maxWidth: 480, mx: 'auto' }}
        >
          Grow your funds with a diverse array of the best portfolios. We
          guarantee risk-free trading.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/dashboard/portfolio')}
        >
          View Stocks
        </Button>
      </CardContent>
      <Box
        sx={{
          width: { xs: '100%', md: '270px' },
          height: { xs: '190px', md: '100%' },
        }}
        className="relative flex md:h-full"
      >
        <MyImage
          src="/assets/images/dashboard-image.png"
          className="absolute left-0 bottom-0"
          alt="dashboard-illustration"
        />
        <MyImage2
          src="/assets/images/dashboard-image-2.png"
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          alt="dashboard-illustration"
        />
      </Box>
    </RootStyle>
  );
}
