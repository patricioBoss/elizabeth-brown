'use client';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Button } from '@mui/material';
// utils
import { fCurrency, fPercent } from '@/utils/formatNumber';
// components
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(() => ({
  width: '100%',
  boxShadow: 'none',
  position: 'relative',
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 48,
  height: 48,
  display: 'flex',
  borderRadius: '50%',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(3),
  right: theme.spacing(3),
  justifyContent: 'center',
}));

// ----------------------------------------------------------------------

type ColorType = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

interface CustomAccountSummaryProps {
  title: string;
  total: number;
  icon: string;
  percent: number;
  color?: ColorType;
  reinvest?: () => void;
}

export default function CustomAccountSummary({
  reinvest,
  title,
  total,
  icon,
  percent,
  color = 'primary',
}: CustomAccountSummaryProps) {
  const theme = useTheme();

  return (
    <RootStyle
      sx={{
        color: (theme) => (theme.palette[color] as any).darker,
        bgcolor: (theme) => (theme.palette[color] as any).lighter,
      }}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => (theme.palette[color] as any).lighter,
          bgcolor: (theme) => (theme.palette[color] as any).dark,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </IconWrapperStyle>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography sx={{ typography: 'subtitle2' }}>{title}</Typography>
        <Typography sx={{ typography: 'h3' }}>{fCurrency(total)}</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <div>
            <Iconify
              width={20}
              height={20}
              icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
            />
            <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
              {percent > 0 && '+'}
              {fPercent(percent)}
            </Typography>
            <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
              &nbsp;than last month
            </Typography>
          </div>

          {reinvest && (
            <Button
              variant="contained"
              className="justify-end"
              onClick={reinvest}
              color={color}
            >
              Reinvest
            </Button>
          )}
        </Stack>
      </Stack>
    </RootStyle>
  );
}
