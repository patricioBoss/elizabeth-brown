'use client';

import React, { useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import { BsInstagram } from 'react-icons/bs';

const Hero: React.FC = () => {
  useEffect(() => {
    // Cleanup function if needed
    return () => {};
  }, []);

  return (
    <section
      className="py-36 h-auto items-center flex relative"
      id="home"
      style={{
        backgroundImage: 'url(/img/bg/1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="container relative text-white">
        <h1 className="font-inter font-extralight text-5xl mb-4 md:mb-0 md:text-[72px] md:tracking-[-3px] text-center">
          Elizabeth Mende Brown, CIMA®
        </h1>
        <h2 className="font-inter text-base md:text-[25px] md:tracking-[-2.5px] leading-normal text-center">
          Senior Vice President, Wealth Management, Financial Advisor, Family
          Wealth Advisor, International Client Advisor
        </h2>
        <div className="flex justify-center gap-[15px] mt-8">
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:elizabethmendebrown@gmail.com"
          >
            <IoIosMail className="h-[32px] w-[32px]" />
          </a>
        </div>
        <p className="text-lg mt-[16px] text-center">
          <span className="font-bold">Direct:&nbsp;&nbsp;</span>
          (+1(432)246-4294)
        </p>
        <div className="flex justify-center mt-[30px]">
          <a
            href="https://wa.me/+14322464294"
            target="_blank"
            rel="noreferrer"
            className="py-4 px-[48px] bg-[#3182c1] text-[19px] rounded-full"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
