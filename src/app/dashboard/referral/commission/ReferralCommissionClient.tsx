'use client';

import { Container, Typography } from '@mui/material';
import Image from 'next/image';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import CopyClipboard from '@/components/dashboard/CopyToClipboard';
import ReferralList from '@/components/dashboard/ReferralList';

// ----------------------------------------------------------------------

interface User {
  _id: string;
  email: string;
}

interface ReferralCommission {
  userId: {
    _id: string;
    email: string;
  };
  createdAt: string;
  amount: number;
}

interface ReferralCommissionClientProps {
  user: User;
  referralCommissions: ReferralCommission[];
}

// ----------------------------------------------------------------------

export default function ReferralCommissionClient({
  user,
  referralCommissions,
}: ReferralCommissionClientProps) {
  const { themeStretch } = useSettings();

  return (
    <Page title="All Referral">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Referral Earnings</Typography>
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
        <ReferralList row={referralCommissions} />
      </Container>
    </Page>
  );
}
