'use client';

import React from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
// utils
import { fPercent } from 'src/utils/formatNumber';
import numeral from 'numeral';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}));

// ----------------------------------------------------------------------

interface AppWidgetSummaryProps {
  chartColor?: string;
  percent: number;
  title: string;
  total: number;
}

export default function AppWidgetSummary({
  title,
  percent,
  total,
}: AppWidgetSummaryProps) {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
          <IconWrapperStyle
            sx={{
              ...(percent < 0 && {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.16),
              }),
            }}
          >
            <Iconify
              width={16}
              height={16}
              icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
            />
          </IconWrapperStyle>
          <Typography component="span" variant="subtitle2">
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Typography>
        </Stack>

        <Typography variant="h3">{`${numeral(total).format('0.00')}`}</Typography>
      </Box>
    </Card>
  );
}
