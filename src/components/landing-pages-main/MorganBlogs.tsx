'use client';

import {
  BanknotesIcon,
  BriefcaseIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import React from 'react';

const MorganBlogs: React.FC = () => {
  return (
    <div className="bg-white">
      <h3 className="text-[46px] text-center pt-16 font-thin">
        Advisor Brokerage Details
      </h3>
      <div className="bg-white py-24 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto max-w-xs">
              <div className="mx-auto w-[100px] flex justify-center items-center h-[100px] bg-[#09926a] rounded-full mb-4">
                <BanknotesIcon className="text-white" width={48} />
              </div>
              <div className="flex flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">
                  Average Assets Under Management
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  $463 Billion
                </dd>
              </div>
            </div>
            <div className="mx-auto max-w-xs">
              <div className="mx-auto w-[100px] flex justify-center items-center h-[100px] bg-[#e48f25] rounded-full mb-4">
                <BriefcaseIcon className="text-white" width={48} />
              </div>
              <div className="flex flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">
                  Average Account Size
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  $15 million
                </dd>
              </div>
            </div>
            <div className="mx-auto max-w-xs">
              <div className="mx-auto w-[100px] flex justify-center items-center h-[100px] bg-[#2d708e] rounded-full mb-4">
                <UserGroupIcon className="text-white" width={48} />
              </div>
              <div className="flex flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">
                  Total Number of Accounts
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  168,915
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MorganBlogs;
