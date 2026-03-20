'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, TextField, Card, Box, CardContent } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(() => ({
  height: '100%',
  width: '100%',
  textAlign: 'left',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

interface WalletCardProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  title?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  leadIcon?: React.ReactNode;
  value?: string;
  price?: string;
}

function WalletCard({ name, title, leadIcon, ...rest }: WalletCardProps) {
  return (
    <RootStyle>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            marginTop: '.5rem',
          }}
        >
          <Box
            sx={{
              color: 'primary.lighter',
            }}
          >
            {leadIcon}
          </Box>

          <Typography paddingLeft={2} align={'center'} variant="subtitle2">
            {title}
          </Typography>
        </Box>

        <TextField
          fullWidth
          {...rest}
          sx={{ mt: 2 }}
          size="small"
          name={name}
          variant="outlined"
          placeholder={'Enter wallet address'}
        />
      </CardContent>
    </RootStyle>
  );
}

export default WalletCard;
