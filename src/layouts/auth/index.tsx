'use client';

import React, { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// components
import Logo from 'src/components/logo';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <Container maxWidth="sm">
      <Stack sx={{ mb: 5, alignItems: 'center' }}>
        <Logo sx={{ mb: 3, height: 40 }} />
        {title && (
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
        )}
      </Stack>
      {children}
    </Container>
  );
};

export default AuthLayout;
