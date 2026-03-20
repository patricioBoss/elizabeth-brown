'use client';

import Image from 'next/image';
import React from 'react';
import { Card, CardContent, styled, Typography } from '@mui/material';
import numeral from 'numeral';
import dynamic from 'next/dynamic';
import { merge } from 'lodash';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
// helpers
import stocks from '@/helpers/stocks';
// components
import Iconify from '@/components/iconify';
// utils
import { fCurrency, fPercent } from '@/utils/formatNumber';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  height: '100%',
  width: '100%',
  textAlign: 'left',
  alignItems: 'center',
  border: '1px solid #cdcdcd ',
  padding: 0,
  '&:hover': {
    boxShadow: theme.shadows[12],
  },
}));

// ----------------------------------------------------------------------

interface StocksCardProps {
  stockData: {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    longName?: string;
  };
  chartData: number[];
}

// ----------------------------------------------------------------------

const StocksCard = ({ stockData, chartData }: StocksCardProps) => {
  const theme = useTheme();

  const baseOptions = {
    colors: [
      theme.palette.primary.main,
    ],
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
    },
    states: {
      hover: { filter: { type: 'lighten', value: 0.04 } },
      active: { filter: { type: 'darken', value: 0.88 } },
    },
    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 3, curve: 'smooth' as const, lineCap: 'round' as const },
    grid: { strokeDashArray: 3, borderColor: theme.palette.divider },
    xaxis: { axisBorder: { show: false }, axisTicks: { show: false } },
    markers: { size: 0, strokeColors: theme.palette.background.paper },
    tooltip: { x: { show: false } },
    legend: {
      show: true,
      fontSize: String(13),
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      markers: { radius: 12 },
      fontWeight: 500,
      itemMargin: { horizontal: 12 },
      labels: { colors: theme.palette.text.primary },
    },
  };

  const chartOptions = merge(baseOptions, {
    colors: [(stocks as Record<string, any>)[stockData.symbol]?.bg ?? theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    stroke: { width: 3 },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: number) => fCurrency(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    fill: { gradient: { opacityFrom: 0.56, opacityTo: 0.56 } },
  });

  return (
    <Link href={'/dashboard/portfolio/' + stockData.symbol}>
      <RootStyle>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            height: '100%',
            '&:last-child': {
              padding: 0,
            },
          }}
        >
          <div className=" w-full h-full rounded-[2rem] flex flex-col justify-between cursor-pointer">
            <div className=" w-full h-full flex flex-col justify-between p-4">
              <div className=" flex justify-between mb-8">
                <Image
                  src={(stocks as Record<string, any>)[stockData.symbol]?.imgUrl ?? ''}
                  className=" rounded-full"
                  width={70}
                  height={70}
                  alt="google"
                />
                <div
                  className={`border border-solid border-[#cdcdcd] rounded-full w-[60px] h-[60px] flex flex-col justify-center items-center ${
                    stockData.regularMarketChangePercent >= 0
                      ? ' text-green-500'
                      : 'text-red-500'
                  } p-2`}
                >
                  <Iconify
                    width={17}
                    height={17}
                    icon={
                      stockData.regularMarketChangePercent >= 0
                        ? 'eva:trending-up-fill'
                        : 'eva:trending-down-fill'
                    }
                  />
                  <p className="text-sm">
                    {fPercent(stockData.regularMarketChangePercent)}
                  </p>
                </div>
              </div>
              <div className="mb-6 flex justify-between">
                <div className=" flex flex-col items-start ">
                  <Typography
                    sx={{ lineHeight: 1, textAlign: 'left', mb: 1 }}
                    variant="h5"
                  >
                    {stockData.shortName}
                  </Typography>
                  <p className=" text-xs">{stockData.symbol} . NASDAQ</p>
                </div>
                <div className=" flex flex-col items-start self-end">
                  <p className=" text-[10px] leading-[.5rem]">Current price</p>
                  <Typography variant="h3">
                    {`${numeral(stockData.regularMarketPrice).format('0,0.00')}`}
                    <span className="text-sm leading-[.5rem] font-normal">
                      USD
                    </span>
                  </Typography>
                </div>
              </div>
            </div>
            <div className="w-full justify-end">
              <ReactApexChart
                type="area"
                series={[{ data: chartData }]}
                options={chartOptions as any}
                height={120}
                width="100%"
              />
            </div>
          </div>
        </CardContent>
      </RootStyle>
    </Link>
  );
};

export default StocksCard;
