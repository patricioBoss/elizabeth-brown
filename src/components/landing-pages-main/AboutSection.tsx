'use client';

import Image from 'next/image';
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="container -translate-y-[100px] md:flex py-6 gap-7 h-fit">
      <Image
        className="w-full md:w-[390px] md:h-[663.09px]"
        src="/assets/images/elizabeth-brown.jpg"
        width={390}
        height={663.09}
        alt="Elizabeth Mende Brown"
        priority
      />
      <div className="bg-white flex-1 p-3 md:p-[30px] flex mt-7 md:mt-0 flex-col">
        <h4 className="font-black text-lg">MY MISSION STATEMENT</h4>
        <div className="flex-1 flex justify-center items-center">
          <p className="my-20 md:m-auto font-inter text-[21px] text-center">
            Expertise, knowledge, and personalized support to help you achieve
            your aspirations and reach your full potential.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
