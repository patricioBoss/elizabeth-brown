'use client';

import { useEffect } from 'react';
import { useRouter } from '@bprogress/next';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';
import axios from 'axios';
import { toast } from 'react-toastify';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Stack,
  Drawer,
  Avatar,
  Typography,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { BiLogOut } from 'react-icons/bi';
// hooks
import useResponsive from 'src/hooks/useResponsive';
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';
// config
import { NAVBAR } from 'src/config-global';
// components
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import NavSectionVertical from 'src/components/nav-section/vertical';
// helpers
import { getUserById } from 'src/helpers/fetchers';
// nav config
import sidebarConfig from './nav-config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.action.hover,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

interface NavbarVerticalProps {
  isOpenSidebar?: boolean;
  onCloseSidebar?: () => void;
  user?: any;
}

export default function NavbarVertical({
  isOpenSidebar,
  onCloseSidebar,
  user,
}: NavbarVerticalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isCollapse, collapseClick, collapseHover } = useCollapseDrawer();
  const isDesktop = useResponsive('up', 'lg');

  // SWR for live user data
  const url = user?._id ? `/api/user/${user._id}` : null;
  const { data } = useSWR(url, getUserById);
  const profile = data ?? user ?? {};

  useEffect(() => {
    if (isOpenSidebar && onCloseSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    router.push('/login');
    axios
      .get('/api/auth/logout')
      .then(() => {
        console.log('logged out.');
      })
      .catch((err) => {
        console.log(err);
      });
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
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo size="small" type="full" sx={{ width: 'auto' }} />
        </Stack>

        {/* NavbarAccount */}
        <Link underline="none" color="inherit">
          <AccountStyle
            sx={{
              ...(isCollapse && { bgcolor: 'transparent' }),
            }}
          >
            <Avatar
              src={profile?.picture || profile?.imageUrl}
              alt={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
            />
            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && { ml: 0, width: 0, overflow: 'hidden' }),
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {`${profile?.firstName || ''} ${profile?.lastName || ''}`}
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                user
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Stack>

      <NavSectionVertical data={sidebarConfig as any} />

      <Box px={2} mt={1}>
        <List disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, minHeight: 44, padding: '4px 8px 4px 12px' }}
          >
            <ListItemIcon sx={{ minWidth: 0, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', mr: 2 }}>
              <BiLogOut />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary="logout"
              sx={{ typography: 'body2', textTransform: 'capitalize', fontWeight: 500 }}
            />
          </ListItemButton>
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
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
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
