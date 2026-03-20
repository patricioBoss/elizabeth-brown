'use client';

import React, { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useCollapseDrawer from 'src/hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from 'src/config-global';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<{ collapseClick?: boolean }>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    picture?: string;
  };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const { collapseClick, isCollapse } = useCollapseDrawer();

  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader
        user={user}
        isCollapse={isCollapse}
        onOpenSidebar={() => setOpen(true)}
      />

      <NavbarVertical
        user={user}
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />

      <MainStyle collapseClick={collapseClick}>{children}</MainStyle>
    </Box>
  );
}
