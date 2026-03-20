'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const TickerTape = dynamic(() => import('react-ts-tradingview-widgets').then((w) => w.TickerTape), {
  ssr: false,
});

const LocationMap = dynamic(() => import('./LocationMap'), { ssr: false });

interface Tab {
  name: string;
}

const tabs: Tab[] = [
  { name: 'My Story and Services' },
  { name: 'Client Service Team' },
  { name: 'Location' },
];

const services: string[] = [
  'Wealth Management',
  'Retirement Planning',
  'Business Planning',
  '401(k) Rollovers',
  'Trust Services',
  'Sustainable Investing',
  '529 Plans',
  'Corporate Retirement Plans',
];

const MyStory: React.FC = () => {
  const [more, setMore] = useState(false);

  return (
    <div className="w-full">
      <div className="md:flex mt-8">
        <div className="md:w-3/5 pl-3 pr-4">
          <h4 className="text-2xl font-bold mb-[14px] mt-5">My Story and Services</h4>
          <div className="relative pt-[56.25%]">
            <iframe
              allowFullScreen
              className="absolute top-0 left-0 h-full border-none w-full"
              allow="encrypted-media"
              src="https://players.brightcove.net/644391012001/OsECwOFeq_default/index.html?videoId=6040280424001"
              title="Video player"
            />
          </div>

          <p className="text-base mt-[14px]">
            My goal is to thoroughly understand your financial needs and align the right resources to
            help you meet — and exceed — them. Whether you are planning for retirement, growing a
            business, or building generational wealth, I am here to help you evaluate near-term
            priorities and design a long-term strategy that is uniquely yours.
            <br />
            {more && <br />}
            {more && (
              <span>
                <span className="font-semibold">Elizabeth Mende Brown: </span>
                &quot;I am a registered financial advisor with National Financial Services LLC
                (CRD#&nbsp;13041), a Fidelity Investments company and one of the largest clearing
                and custody firms in the United States. I have been registered with the firm since
                December 2023 and operate across our offices in Durham, NC and Boston, MA. My
                practice is built on the belief that every client deserves a clear, personalized
                financial plan — not a one-size-fits-all approach. I work closely with
                individuals, families, business owners, and institutional clients to develop
                strategies across wealth management, retirement planning, portfolio construction,
                and estate planning. National Financial Services LLC is a registered broker-dealer
                and a member of FINRA/SIPC, and through this platform I am able to provide access
                to a full spectrum of investment products and advisory solutions backed by
                institutional-grade research and technology.&quot;
              </span>
            )}
            <br />
            <span
              className="text-[#0F8EC7] hover:underline transition-all duration-500 flex gap-3 cursor-pointer"
              onClick={() => setMore((x) => !x)}
            >
              {!more ? 'About me — read more' : 'Show less'}
              {!more ? <ChevronDownIcon className="w-4" /> : <ChevronUpIcon className="w-4" />}
            </span>
          </p>
        </div>
        <div className="md:w-2/5 pl-4 pr-3">
          <h4 className="text-2xl font-bold mb-[14px]">Services Include</h4>
          <ul className="list-disc mt-4 pl-8">
            {services.map((service) => (
              <li key={service} className="text-base mb-[6px]">
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-3">
        <p className="text-[#757575] my-[62px]">
          Registered with National Financial Services LLC (CRD#: 13041) since 12/11/2023.
          Securities Agent: DC, WI, WA, VT, VA, UT, TX, TN, SC, RI, OH, NY, NJ, NC, MI, MD, MA,
          LA, KY, KS, GA, FL, CO, CA, AZ, OR; General Securities Representative; Investment Advisor
          Representative.
        </p>
        <div className="border-t border-t-[#CCCCCC]">
          <p className="text-sm my-[32px]">
            Check the background of our firm and investment professionals on{' '}
            <a
              href="https://brokercheck.finra.org/"
              target="_blank"
              rel="noreferrer"
              className="text-[#0F8EC7] cursor-pointer text-base font-bold underline"
            >
              FINRA&apos;s BrokerCheck
            </a>
            . National Financial Services LLC is a member of FINRA/SIPC.
          </p>
        </div>
      </div>
    </div>
  );
};

const ServiceTeam: React.FC = () => {
  return (
    <div className="p-[1.875rem]">
      <h4 className="text-2xl font-bold my-[1rem] mt-3">The Service Team</h4>
      <h6 className="font-bold text-lg my-[0.5rem]">
        Elizabeth Mende Brown — Financial Advisor
      </h6>
      <p className="mb-4">
        Elizabeth Mende Brown is a registered financial advisor with National Financial Services
        LLC (CRD#: 13041), a Fidelity Investments company providing institutional-grade clearing,
        custody, and brokerage services. Her practice is centred on delivering thoughtful,
        personalised financial guidance to individuals, families, and business owners at every
        stage of their financial journey.
      </p>
      <p className="mb-6">
        With offices located at 100 New Millennium Way, Durham, NC and 245 Summer Street,
        Boston, MA, Elizabeth and her team bring together deep market knowledge and a
        client-first philosophy to help you build, protect, and transfer wealth with confidence.
        Every engagement begins with listening — because the right strategy starts with truly
        understanding your goals, values, and timeline.
      </p>
      <div className="space-y-1">
        <p className="text-base">
          <span className="font-semibold">Firm:</span> National Financial Services LLC (CRD#: 13041)
        </p>
        <p className="text-base">
          <span className="font-semibold">Registered Since:</span> December 11, 2023
        </p>
        <p className="text-base">
          <span className="font-semibold">Phone:</span> +1(918)780-1300
        </p>
        <p className="text-base">
          <span className="font-semibold">Email:</span> elizabethmendebrown@gmail.com
        </p>
      </div>
    </div>
  );
};

const MyLocation: React.FC = () => {
  return (
    <div className="p-[1.875rem]">
      <div className="mt-10 md:flex md:pr-10">
        <div className="md:flex-1">
          <h4 className="text-2xl font-bold mb-[14px] mt-5">LOCATIONS</h4>
          <p className="text-base font-semibold mb-1">Main Office</p>
          <p className="text-base mb-4">
            100 New Millennium Way
            <br />
            Durham, NC 27709-8204, USA
            <br />
            Direct: +1(918)780-1300
          </p>
          <p className="text-base font-semibold mb-1">Boston Office</p>
          <p className="text-base">
            245 Summer Street
            <br />
            Boston, MA 02210, USA
          </p>
        </div>
        <div className="md:flex-1 overflow-hidden">
          <LocationMap />
        </div>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  const [selected, setSelected] = useState(tabs[0].name);

  return (
    <div className="container -translate-y-[100px] flex py-6 gap-7 h-fit">
      <div id="portfolio-details" className="bg-white w-full p-4">
        <div className="border-b border-gray-200 max-w-fit">
          <div className="-mb-px flex overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setSelected(tab.name)}
                className={
                  (selected === tab.name
                    ? 'border-[#0F8EC7] '
                    : 'border-transparent hover:border-[#0F8EC7]') +
                  ' whitespace-nowrap text-[#002B51] py-3 px-[15px] border-b-4 text-base'
                }
                aria-current={selected === tab.name ? 'page' : undefined}
                type="button"
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        {selected === tabs[0].name && <MyStory />}
        {selected === tabs[1].name && <ServiceTeam />}
        {selected === tabs[2].name && <MyLocation />}
      </div>
    </div>
  );
};

export default Services;

export const PortfolioCTA: React.FC = () => {
  return (
    <div className="mt-10 w-full">
      <TickerTape />
      <div className="bg-[#0F8EC7] py-[75px]">
        <div className="max-w-768 text-center text-white mx-auto">
          <h5 className="text-2xl mt-3">Wealth Management</h5>
          <h5 className="text-2xl mt-3">Global Investment Office</h5>
          <h6 className="my-[90px] font-inter text-[30px]">Portfolio Insights</h6>
          <a
            href="#faqs"
            className="py-[16px] px-[52px] rounded-full text-[19px] border-2 border-[rgba(255,255,255,0.5)] font-bold hover:bg-white hover:text-[#0F8EC7]"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};
