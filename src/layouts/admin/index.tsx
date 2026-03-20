'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { FiHome } from 'react-icons/fi';
import { BsCreditCard2Back } from 'react-icons/bs';
import { HiMail } from 'react-icons/hi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { AiFillSetting } from 'react-icons/ai';
import SvgColor from 'src/components/svg-color';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from 'src/config-global';
// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import NavSectionVertical from 'src/components/nav-section/vertical';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgColor src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const adminNavConfig = [
  {
    items: [
      { title: 'userList', path: '/admin/home', icon: getIcon('ic_user') },
      { title: 'Investments', path: '/admin/invest', icon: getIcon('ic_analytics') },
      {
        title: 'Withdrawal',
        path: '/admin/withdrawal',
        icon: <BsCreditCard2Back />,
      },
      {
        title: 'Fee Payment',
        path: '/admin/fee',
        icon: <RiMoneyDollarCircleLine />,
      },
      { title: 'Mail', path: '/admin/mail', icon: <HiMail /> },
    ],
  },
];

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const NavbarAccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

const HeaderStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
  },
}));

// ----------------------------------------------------------------------

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    picture?: string;
  };
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const router = useRouter();
  const { isCollapse, collapseClick } = useCollapseDrawer();
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    router.push('/admin/login');
    axios.get('/api/auth/logout').catch(() => {});
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{ pt: 3, pb: 2, px: 2.5, flexShrink: 0 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo size="small" type="full" sx={{ width: 'auto' }} />
        </Stack>

        <Link underline="none" color="inherit">
          <NavbarAccountStyle
            sx={{
              ...(isCollapse && {
                bgcolor: 'transparent',
              }),
            }}
          >
            <Avatar src="/assets/images/default.png" alt="Admin User" />

            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                }),
              }}
            >
              <Typography variant="subtitle2" noWrap>
                Dashboard
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                Admin
              </Typography>
            </Box>
          </NavbarAccountStyle>
        </Link>
      </Stack>

      <NavSectionVertical data={adminNavConfig as any} />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box sx={{ display: { lg: 'flex' }, minHeight: { lg: 1 } }}>
      {/* Header */}
      <HeaderStyle>
        <Toolbar sx={{ minHeight: '100% !important', px: { lg: 5 } }}>
          {!isDesktop && (
            <IconButton onClick={() => setOpen(true)} sx={{ mr: 1, color: 'text.primary' }}>
              <Iconify icon="eva:menu-2-fill" />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar
              src={user?.picture || '/assets/images/default.png'}
              alt={user?.firstName || 'Admin'}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { width: 180 } }}
          >
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Iconify icon="eva:log-out-fill" sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </HeaderStyle>

      {/* Navbar */}
      <RootStyle
        sx={{
          width: { lg: NAVBAR.DASHBOARD_WIDTH },
          ...(collapseClick && { position: 'absolute' }),
        }}
      >
        {!isDesktop && (
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
          >
            {renderContent}
          </Drawer>
        )}

        {isDesktop && (
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: NAVBAR.DASHBOARD_WIDTH,
                borderRightStyle: 'solid',
                bgcolor: 'background.default',
              },
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </RootStyle>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: `${HEADER.MOBILE_HEIGHT + 24}px`,
          paddingBottom: `${HEADER.MOBILE_HEIGHT + 24}px`,
          paddingLeft: 2,
          paddingRight: 2,
          [`@media (min-width:1200px)`]: {
            paddingTop: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            paddingBottom: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
