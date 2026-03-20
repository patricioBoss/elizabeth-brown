'use client';

import { Container, Typography, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import WalletCards from '@/components/dashboard/WalletCard';

// ----------------------------------------------------------------------

interface Wallets {
  usdt: string;
  btc: string;
  eth: string;
}

interface UserData {
  _id: string;
  wallets?: Wallets;
}

interface WalletClientProps {
  user: UserData;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// ----------------------------------------------------------------------

export default function WalletClient({ user }: WalletClientProps) {
  const { themeStretch } = useSettings();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Wallets>({
    usdt: user.wallets?.usdt || '',
    btc: user.wallets?.btc || '',
    eth: user.wallets?.eth || '',
  });

  const url = `/api/user/${user._id}`;
  const { data } = useSWR<UserData>(url, fetcher);

  useEffect(() => {
    if (data?.wallets) {
      const { wallets } = data;
      setAddresses((addr) => ({ ...addr, ...wallets }));
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddresses((adrs) => ({
      ...adrs,
      [name]: value,
    }));
  };

  const updateWallet = () => {
    if (
      addresses.btc.trim() === '' &&
      addresses.usdt.trim() === '' &&
      addresses.eth.trim() === ''
    ) {
      toast.info('both wallets cannot be empty');
      return;
    }
    setLoading(true);
    axios
      .put(`/api/user/${user._id}/wallet`, addresses)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <Page title="wallet">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Wallet Address</Typography>
        <Typography variant="body2" mb={3}>
          Edit wallet Addresses and save changes, Please note that we are not
          responsible if payment is being made to the wrong Wallet Address. make
          sure your wallet address is CORRECT before requesting for withdrawal.
        </Typography>
        <Typography variant="body2" mb={1}>
          Last Updated:
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <WalletCards
              name="usdt"
              onChange={handleChange}
              price=""
              title="Tether(USDT) Wallet"
              value={addresses.usdt}
              leadIcon={
                <img
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  src={`/icons/usdt.svg`}
                  alt="coin icon"
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <WalletCards
              name="btc"
              onChange={handleChange}
              price=""
              title="Bitcoin(BTC) Wallet"
              value={addresses.btc}
              leadIcon={
                <img
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  src={`/icons/btc.svg`}
                  alt="coin icon"
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <WalletCards
              name="eth"
              onChange={handleChange}
              price=""
              title="Etherum(ETH) Wallet"
              value={addresses.eth}
              leadIcon={
                <img
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  src={`/icons/eth.svg`}
                  alt="coin icon"
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              onClick={updateWallet}
            >
              <span>Update Wallet </span>
            </LoadingButton>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
