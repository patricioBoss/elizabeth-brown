'use client';

import React from 'react';
import Link from 'next/link';
import LandingLayout from '../../components/landing-layout/LandingLayout';
import Footer from '../../components/landing-pages-main/Footer';
import Navbar from '../../components/landing-pages-main/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="relative bg-gray-50">
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-green-600">About</h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Take control of your team.
            </p>
            <p className="mx-auto mt-5 text-xl text-gray-500">
              In this our modern day and age owning stocks has never been
              easier. We have made it possible for you to get access to on
              demand stock of various multinational companies, buying a small
              piece of ownership in a company. As a stockholder, you have the
              potential to benefit from the company&apos;s success through
              stock price appreciation and dividends. We have helped fine tune
              the process of buying stocks and investing with some of our
              interesting products.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex flex-col border-b border-gray-200 lg:border-0">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute hidden h-full w-1/2 lg:block"
            />
            <div className="relative lg:bg-transparent">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
                <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-36">
                  <div className="lg:pr-16">
                    <div className="flex">
                      <h3 className="text-green-600 py-2 px-3 rounded-full border-2 border-green-700 font-semibold mb-8">
                        Fixed Return
                      </h3>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                      Get as low as to <span>8% Returns</span> Easy
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                      With Shared Fixed Returns, we take all the work out of
                      investing while you earn all the rewards. The Dollar
                      rewards that is.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="#"
                        className="inline-block rounded-md border border-transparent bg-green-600 py-3 px-8 font-medium text-white hover:bg-green-700"
                      >
                        Start Investing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-48 w-full sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2">
              <img
                src="https://tailwindui.com/img/ecommerce-images/home-page-02-hero-half-width.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-green-700 pt-12 pb-20">
        <div className="absolute w-1/2 hidden md:block bottom-0 top-0 bg-[url(/assets/images/sidecut.jpg)] bg-no-repeat bg-cover bg-center" />
        <div className="container">
          <div className="flex">
            <div className="flex-1 hidden md:block" />
            <div className="flex-1">
              <div className="px-8 text-center md:text-left">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-5xl mb-8 sm:leading-[4rem]">
                  Smart Automated{' '}
                  <span className="bg-orange-400 rounded-md px-1">
                    investing.
                  </span>
                </h3>
                <p className="mt-3 text-lg text-gray-50 mb-8">
                  Smart Portfolio is a robo-advisor that gives you a
                  diversified portfolio based on your risk profile. It&apos;s
                  the easy way to invest. Using uptodate algorithms and
                  technology to provide automated, algorithm-driven investment
                  management services.With little minimum investment, making it
                  accessible for people who want to start investing but may not
                  have a lot of money to invest. We allow you to set specific
                  financial goals with our provide personalized investment plans
                  that will surely help you reach those goals
                </p>
                <Link
                  href="/register"
                  className="rounded-md border border-transparent px-8 py-3 text-base font-medium bg-white hover:bg-gray-50 text-[#006642] md:py-4 md:px-10 md:text-lg"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
