'use client';

import { Container, Typography } from '@mui/material';
import Image from 'next/image';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import CopyClipboard from '@/components/dashboard/CopyToClipboard';
import AffiliateUserTable from '@/components/dashboard/AffiliateUserTable';

// ----------------------------------------------------------------------

interface User {
  _id: string;
  email: string;
}

interface AffiliateUser {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isVerified: boolean;
}

interface ReferralListClientProps {
  user: User;
  affiliateUsers: AffiliateUser[];
}

// ----------------------------------------------------------------------

export default function ReferralListClient({ user, affiliateUsers }: ReferralListClientProps) {
  const { themeStretch } = useSettings();

  return (
    <Page title="All Referral">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Explore, Refer And Earn.</Typography>
        <div className=" w-full relative mb-10">
          <Image src={'/img/referral-banner.png'} width={1524} height={329} alt="referral banner" />
        </div>
        <div className=" max-w-lg">
          <h4 className=" text-[24px] font-medium">Copy Referral Link</h4>
          <CopyClipboard
            value={`${typeof window !== 'undefined' ? window.location.hostname : ''}?ref=${
              user?._id ?? ''
            }`}
            size="small"
            disabled
          />
        </div>
        <AffiliateUserTable row={affiliateUsers} />
      </Container>
    </Page>
  );
}
