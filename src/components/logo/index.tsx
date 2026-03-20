import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Link from 'next/link';
// @mui
import { Box, SxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps;
  size?: 'small' | 'large';
  type?: 'single' | 'full';
}

// eslint-disable-next-line react/display-name
const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, size = 'large', type = 'single' }, ref) => {
    const logo =
      type === 'single' ? (
        <Box
          ref={ref}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'end',
            ...sx,
          }}
        >
          <img
            style={
              size === 'large'
                ? { width: '100%', height: '100%' }
                : { width: '70%', height: '70%' }
            }
            src="/logo/logo.svg"
            alt="logo img"
          />
        </Box>
      ) : (
        <Box
          ref={ref}
          sx={{
            width: 250,
            cursor: 'pointer',
            ...sx,
          }}
        >
          <img
            style={size === 'large' ? { width: '100%' } : { width: '70%' }}
            src="/logo/logo.svg"
            alt="logo img"
          />
        </Box>
      );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return <Link href="/">{logo}</Link>;
  }
);

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  size: PropTypes.oneOf(['small', 'large']),
  type: PropTypes.oneOf(['single', 'full']),
};

export default Logo;
