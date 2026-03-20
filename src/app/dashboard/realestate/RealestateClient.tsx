'use client';

import {
  Container,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import useSWR from 'swr';
// hooks
import useSettings from '@/hooks/useSettings';
// components
import Page from '@/components/page';
import PlanCards from '@/components/dashboard/PlanCards';
import plans from '@/helpers/plans';
import { getUserById } from '@/helpers/fetchers';

// ----------------------------------------------------------------------

interface Coin {
  price_usd: number;
  asset_id: string;
}

interface CoinList {
  [key: string]: Coin;
}

interface RealestateClientProps {
  user: any;
  coinList: CoinList | null;
}

// ----------------------------------------------------------------------

export default function RealestateClient({ user, coinList }: RealestateClientProps) {
  const { themeStretch } = useSettings();
  const [coin, setCoin] = useState('btc');

  const url = user ? `/api/user/${user._id}` : null;
  const { data: userData } = useSWR(url, getUserById);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setCoin(e.target.value);
  };

  if (!coinList) return null;

  return (
    <Page title="All Plans">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography id="select-coin" ml={1} variant="body1" color="primary">
          Select coin to Invest
        </Typography>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 300 }}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={coin}
            defaultValue="btc"
            sx={{ maxWidth: 400 }}
            size="medium"
            onChange={handleChange}
            variant="outlined"
          >
            <MenuItem value={'btc'}>BITCOIN (BTC)</MenuItem>
            <MenuItem value={'usdt'}>TETHER (USDT)</MenuItem>
            <MenuItem value={'eth'}>{'Ethereum'.toUpperCase()} (ETH)</MenuItem>
            <MenuItem value={'xrp'}>XRP (XRP)</MenuItem>
            <MenuItem value={'doge'}>{'DogeCoin'.toUpperCase()} (DOGE)</MenuItem>
          </Select>
        </FormControl>
        <Grid mt={1} container spacing={3}>
          {plans.map((plan, index) => (
            <Grid key={plan.id} item xs={12} sm={6} md={4}>
              <PlanCards
                plan={{ ...plan, id: index }}
                currency={coinList[coin.toUpperCase()]}
                user={userData ? userData : user}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
