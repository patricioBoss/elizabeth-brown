'use client';

import React, { ReactNode } from 'react';
import { Box, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface PageProps {
  children: ReactNode;
  title?: string;
  sx?: SxProps;
}

export default function Page({ children, title, sx }: PageProps) {
  return (
    <Box
      component="div"
      className="page"
      sx={{
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
