'use client';

import React, { ReactNode } from 'react';
import SimpleBar from 'simplebar-react';
import { Box, BoxProps, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface ScrollbarProps extends BoxProps {
  children?: ReactNode;
  sx?: SxProps;
}

export default function Scrollbar({ children, sx, ...other }: ScrollbarProps) {
  return (
    <Box
      component={SimpleBar}
      scrollableNodeProps={{
        style: {
          maxHeight: '100%',
        },
      }}
      sx={{
        minWidth: 0,
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
