'use client';

import React from 'react';
import { Box, BoxProps, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface SvgIconStyleProps extends BoxProps {
  src: string;
  sx?: SxProps;
}

export default function SvgIconStyle({ src, sx, ...other }: SvgIconStyleProps) {
  return (
    <Box
      component="span"
      className="svg-icon-style"
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  );
}
