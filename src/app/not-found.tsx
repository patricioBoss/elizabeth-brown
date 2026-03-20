'use client';

import React from 'react';
import NextLink from 'next/link';
import { Box, Button, Typography, Container, Stack } from '@mui/material';
import { varBounce, MotionContainer } from 'src/components/animate';
import { m } from 'framer-motion';
import Image from 'next/image';

// ----------------------------------------------------------------------

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Stack
        sx={{
          py: 12,
          m: 'auto',
          maxWidth: 400,
          minHeight: '100vh',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            Sorry, resource not found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            ...Sorry the page you are looking for could not be found, Please try
            again
          </Typography>
        </m.div>

        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Image
              src="/assets/images/404-landscape.svg"
              alt="404 not found"
              width={395}
              height={395}
              style={{ margin: '2rem auto' }}
            />
          </m.div>
        </MotionContainer>

        <Button
          component={NextLink}
          href="/"
          size="large"
          variant="contained"
          color="inherit"
        >
          Go to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFoundPage;
