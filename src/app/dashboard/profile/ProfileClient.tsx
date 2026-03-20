'use client';

import { Container, Grid } from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import ProfileBlock from '@/components/dashboard/ProfileBlock';
import PasswordBlock from '@/components/dashboard/PasswordBlock';
import PictureUpdateBlock from '@/components/dashboard/PictureUpdateBlock';
import NotificationBlock from '@/components/dashboard/NotificationBlock';
import AccValidationBlock from '@/components/dashboard/AccValidationBlock';
import ValidationModal from '@/components/dashboard/ValidationModal';
import FeeModalPayment from '@/components/dashboard/FeeModalPayment';
import { getUserById } from '@/helpers/fetchers';

// ----------------------------------------------------------------------

interface UserData {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  state?: string;
  imageUrl?: string;
  isVerified?: boolean;
  IdImg?: string;
  postalCode?: string | number;
  permanentAddress?: string;
}

interface ProfileClientProps {
  user: UserData;
}

// ----------------------------------------------------------------------

export default function ProfileClient({ user: initialUser }: ProfileClientProps) {
  const [open, setOpen] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);
  const { themeStretch } = useSettings();

  const url = `/api/user/${initialUser._id}`;
  const { data } = useSWR<UserData>(url, getUserById);

  const user = data ? data : initialUser;
console.log('ProfileClient user data:', {data,initialUser});
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Page title="Profile">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <PictureUpdateBlock user={user} url={url} />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <ProfileBlock user={user} url={url} />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <PasswordBlock user={user} url={url} />
          </Grid>
          <Grid item xs={12} md={6}>
            <AccValidationBlock
              handleOpen={handleOpen}
              user={user}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NotificationBlock handleFeeOpen={() => setFeeOpen(true)} />
          </Grid>
        </Grid>
      </Container>
      <ValidationModal
        open={open}
        setOpen={setOpen}
        user={user}
        url={url}
      />
      <FeeModalPayment
        open={feeOpen}
        setOpen={setFeeOpen}
        user={user}
        url={url}
      />
    </Page>
  );
}
