'use client';

import { useState } from 'react';
import { useRouter } from '@bprogress/next';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from '@mui/material';
import { GiftIcon } from '@heroicons/react/24/solid';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import ComingSoonModal from 'src/components/dashboard/ComingSoonModal';
// helpers
import { getUserById } from 'src/helpers/fetchers';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse',
})<{ isCollapse?: boolean }>(({ isCollapse, theme }) => ({
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
  },
}));

// ----------------------------------------------------------------------

interface DashboardHeaderProps {
  user?: any;
  isCollapse?: boolean;
  onOpenSidebar?: () => void;
}

export default function DashboardHeader({
  user,
  isCollapse = false,
  onOpenSidebar,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { isCollapse: collapse } = useCollapseDrawer();
  const isDesktop = useResponsive('up', 'lg');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bonusOpen, setBonusOpen] = useState(false);

  // SWR for live user data
  const url = user?._id ? `/api/user/${user._id}` : null;
  const { data } = useSWR(url, getUserById);
  const userData = data ?? user ?? {};

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    axios
      .get('/api/auth/logout')
      .then(() => {
        localStorage.clear();
        toast.success('Logged out successfully');
        router.push('/login');
      })
      .catch(() => {
        localStorage.clear();
        router.push('/login');
      });
  };

  return (
    <RootStyle isCollapse={isCollapse}>
      <Toolbar sx={{ minHeight: '100% !important', px: { lg: 5 } }}>
        {!isDesktop && (
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Bonus Gift Button */}
        <div className="mr-3 sm:mr-6">
          <IconButton
            size="large"
            className="!border !border-[#e33784]"
            onClick={() => setBonusOpen(true)}
          >
            <Badge color="error" variant="dot" invisible={!userData.bonus}>
              <GiftIcon
                height={24}
                width={24}
                className={userData.bonus ? 'text-[#e33784]' : 'text-[#dc7ea8]'}
              />
            </Badge>
          </IconButton>
        </div>

        {/* Level Badge */}
        <div className="mr-3 sm:mr-6">
          <div className="w-8 h-8 rounded font-inter border-2 border-blue-500 font-extrabold text-blue-500 text-base flex justify-center items-center">
            L {userData?.level}
          </div>
        </div>

        {/* Verification Label */}
        <div className="mr-4 sm:mr-8">
          <Label
            variant="outlined"
            color={userData.isVerified ? 'success' : 'error'}
          >
            {userData.isVerified ? 'Account Verified' : 'Account Unverified'}
          </Label>
        </div>

        {/* Account Popover */}
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <IconButton
            onClick={handleOpenMenu}
            sx={{ p: 0 }}
          >
            <Avatar
              src={userData?.picture || userData?.imageUrl || '/assets/images/default.png'}
              alt={userData?.firstName || 'User'}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                p: 0,
                mt: 1.5,
                ml: 0.75,
                width: 200,
                '& .MuiMenuItem-root': {
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {userData.email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack sx={{ p: 1 }}>
              <MenuItem onClick={() => { handleCloseMenu(); router.push('/dashboard/home'); }}>
                Home
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); router.push('/dashboard/profile'); }}>
                Settings
              </MenuItem>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.main' }}>
              <Iconify icon="eva:log-out-fill" sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>

      {userData._id && (
        <ComingSoonModal open={bonusOpen} setOpen={setBonusOpen} user={userData} />
      )}
    </RootStyle>
  );
}
