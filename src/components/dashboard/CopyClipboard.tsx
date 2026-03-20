'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// @mui
import { Tooltip, TextField, IconButton, InputAdornment } from '@mui/material';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

interface CopyClipboardProps {
  value: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  [key: string]: unknown;
}

export default function CopyClipboard({ value, ...other }: CopyClipboardProps) {
  const [state, setState] = useState({
    value,
    copied: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ value: event.target.value, copied: false });
  };

  const onCopy = () => {
    setState({ ...state, copied: true });
    if (state.value) {
      toast.success('Copied');
    }
  };

  return (
    <TextField
      fullWidth
      value={state.value}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CopyToClipboard text={state.value} onCopy={onCopy}>
              <Tooltip title="Copy">
                <IconButton>
                  <Iconify icon={'eva:copy-fill'} width={24} height={24} />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
          </InputAdornment>
        ),
      }}
      {...other}
    />
  );
}
