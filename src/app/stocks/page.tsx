'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  BoltIcon,
  EnvelopeIcon,
  UserIcon,
  WalletIcon,
  LockClosedIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import LandingLayout from '../../components/landing-layout/LandingLayout';

const StockMarket = dynamic(
  () => import('react-ts-tradingview-widgets').then((w) => w.StockMarket),
  { ssr: false }
);

const transferFeatures = [
  {
    id: 1,
    name: 'Create an account',
    description:
      'by selecting your country and instantly verify your identity using your government issued number like your Bank Verification Number or National Identity Number.',
    icon: UserIcon,
  },
  {
    id: 2,
    name: 'Fund Your Wallet',
    description:
      'via multiple channels including your local currency cards and our partner will handle the currency conversion instantly in one click.',
    icon: WalletIcon,
  },
  {
    id: 3,
    name: 'Start Investing',
    description:
      'In your favorite public listed US company, a bundle of companies called an ETF, other African companies, mutual funds, or fixed income products from around the world.',
    icon: BoltIcon,
  },
];

const communicationFeatures = [
  {
    id: 1,
    name: 'Bank Level Security',
    description:
      'You trust us with your investments and we take that very seriously. We are committed to protecting your account with the highest standards of security available.',
    icon: LockClosedIcon,
  },
  {
    id: 2,
    name: 'Covered by US SEC',
    description:
      'Trading accounts are held by our partners, a firm duly registered by the Securities and Exchange Commission in the US and our U.S',
    icon: EnvelopeIcon,
  },
];

const StocksPage: React.FC = () => {
  return (
    <LandingLayout>
      <section className="relative table w-full py-36 lg:py-44 bg-[url('/assets/images/fx_photo.png')] bg-no-repeat bg-center">
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container">
          <div className="grid grid-cols-1 pb-8 text-center mt-12">
            <h3 className="md:text-4xl text-3xl md:leading-normal tracking-wide leading-normal font-medium text-white">
              Stocks/ETFs
            </h3>
          </div>
        </div>
        <div className="absolute text-center z-10 bottom-5 right-0 left-0 mx-3">
          <ul className="breadcrumb tracking-[0.5px] breadcrumb-light mb-0 inline-block">
            <li className="inline breadcrumb-item uppercase text-[13px] font-bold duration-500 ease-in-out text-white/50 hover:text-white">
              <Link href="/">Home</Link>
            </li>
            <li
              className="inline breadcrumb-item uppercase text-[13px] font-bold duration-500 ease-in-out text-white"
              aria-current="page"
            >
              stocks
            </li>
          </ul>
        </div>
      </section>
      <div className="relative">
        <div className="shape absolute right-0 sm:-bottom-px -bottom-[2px] left-0 overflow-hidden text-gray-50">
          <svg
            className="w-full h-auto"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* FeatureSection inlined */}
      <div className="overflow-hidden bg-gray-50 py-16 lg:py-24">
        <div className="relative mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <svg
            className="absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
            />
          </svg>

          <div className="relative">
            <h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Financial Freedom without Boundaries
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-gray-500">
              Investing from Any where in the world has never been easier. Follow
              these easy steps to get started.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
            <div className="relative">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Invest in fractions
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Our fractional investing technology allows you to invest as much
                or as little as you want in your favorite public listed US
                company, a bundle of companies called an ETF, other African
                companies, mutual funds, or fixed income products from around the
                world.
              </p>

              <dl className="mt-10 space-y-10">
                {transferFeatures.map((item) => (
                  <div key={item.id} className="relative">
                    <dt>
                      <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-orange-600 text-white">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                        {item.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative -mx-4 mt-10 lg:mt-0" aria-hidden="true">
              <svg
                className="absolute left-1/2 -translate-x-1/2 translate-y-16 transform hidden"
                width={784}
                height={404}
                fill="none"
                viewBox="0 0 784 404"
              >
                <defs>
                  <pattern
                    id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={784}
                  height={404}
                  fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)"
                />
              </svg>
              <div className="bg-white md:rounded-[1rem] md:shadow-lg w-full p-3">
                <StockMarket width="100%" />
              </div>
            </div>
          </div>

          <svg
            className="absolute right-full hidden translate-x-1/2 translate-y-12 transform lg:block"
            width={404}
            height={784}
            fill="none"
            viewBox="0 0 404 784"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={784}
              fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
            />
          </svg>

          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Let Us Focus on Managing The Risk
                </h3>
                <p className="mt-3 text-lg text-gray-500">
                  We Focus on identifying, assessing, and managing the potential
                  risks that come with an investment. Finding and leveraging on
                  trained optimal algorithm to identify and filter potiential high
                  valuie stocks.
                </p>

                <dl className="mt-10 space-y-10">
                  {communicationFeatures.map((item) => (
                    <div key={item.id} className="relative">
                      <dt>
                        <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600 text-white">
                          <item.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                          {item.name}
                        </p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        {item.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative -mx-4 mt-10 lg:col-start-1 lg:mt-0">
                <svg
                  className="absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden"
                  width={784}
                  height={404}
                  fill="none"
                  viewBox="0 0 784 404"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="e80155a9-dfde-425a-b5ea-1f6fadd20131"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={784}
                    height={404}
                    fill="url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)"
                  />
                </svg>
                <img
                  className="relative mx-auto"
                  width={490}
                  src="/assets/images/standard2.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default StocksPage;
