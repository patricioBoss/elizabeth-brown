'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Ticker = dynamic(
  () => import('react-ts-tradingview-widgets').then((w) => w.Ticker),
  {
    ssr: false,
  }
);

const CTAsection: React.FC = () => {
  return (
    <div className="bg-white pt-12">
      <div className="container">
        <div className="container md:flex md:justify-between py-[30px] border-y border-y-[#CCCCCC]">
          <p className="text-[19px] mb-6">
            Ready to start a conversation? Contact Elizabeth Mende Brown today.
          </p>
          <div>
            <a
              href="https://wa.me/+19187801300"
              target="_blank"
              rel="noreferrer"
              className="mx-auto md:mx-0 py-[16px] px-[52px] rounded-full text-[19px] font-bold text-white bg-[#3182C1] m-auto cursor-pointer"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <Ticker />
      </div>
    </div>
  );
};

export default CTAsection;
