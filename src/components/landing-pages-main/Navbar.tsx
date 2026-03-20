'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';

interface NavItem {
  name: string;
  current: boolean;
  children: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: 'About',
    current: false,
    children: [
      { name: 'My Story and Services', href: '#portfolio-details' },
      {
        name: 'Wealth Management Global Investment Office',
        href: '#portfolio-details',
      },
      { name: 'Thought Leadership', href: '#thought-list' },
    ],
  },
  {
    name: 'Contact Me',
    current: false,
    children: [
      { name: 'Start a Conversation', href: 'https://wa.me/19187801300' },
      { name: 'Location', href: '#portfolio-details' },
    ],
  },
];

interface MobileMenuSlideProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenuSlide: React.FC<MobileMenuSlideProps> = ({ open, setOpen }) => {
  const isDesktop = useMediaQuery('(min-width:768px)');

  return (
    <Transition.Root show={open && !isDesktop} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-8 flex pt-4 pl-2 sm:-mr-10 sm:pl-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white">
                    <div className="w-full">
                      <div className="w-full">
                        <Link href="/">
                          <img
                            className="md:ml-0 h-[29px] mx-auto my-[22px]"
                            src="/logo/logo.svg"
                            alt="logo"
                          />
                        </Link>

                        {navigation.map(({ name, children }) => (
                          <div
                            key={name}
                            className="border-t border-t-[#E9E9E9]"
                          >
                            <div className="py-[22px] px-5 text-xl font-bold cursor-pointer">
                              {name}
                            </div>
                            {children.length &&
                              children.map((link) => (
                                <ul key={link.name} className="pl-5">
                                  <li
                                    className="border-t border-t-[#E9E9E9] w-full pl-[25px] hover:bg-[#0000004c]"
                                    onClick={() => {
                                      setOpen(false);
                                    }}
                                  >
                                    <a
                                      href={link.href.startsWith('#') ? link.href : '/' + link.href}
                                      className="text-base py-[25px] pr-[63px] block"
                                    >
                                      {link.name}
                                    </a>
                                  </li>
                                </ul>
                              ))}
                          </div>
                        ))}
                        <div className="border-t border-t-[#E9E9E9]">
                          <div className="py-[22px] px-5 text-xl font-bold flex items-center cursor-pointer">
                            <svg
                              className="mr-1"
                              width="17"
                              height="15"
                              viewBox="0 0 17 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_1_489)">
                                <g clipPath="url(#clip1_1_489)">
                                  <path
                                    d="M17.611 13.3868C17.608 12.6198 17.071 12.6018 16.428 12.3448L13.428 11.1428C13.3759 11.1223 13.3242 11.1007 13.273 11.0778C12.74 10.8358 12.269 10.4998 12.096 10.2638C12.0825 10.245 12.0699 10.2256 12.058 10.2058C11.964 10.0618 11.883 10.0088 11.815 10.0318C11.717 10.0818 11.733 10.0358 11.7 9.94678C11.619 9.72678 11.485 9.30978 11.464 9.24878C11.433 9.13478 11.349 9.42878 11.368 9.11078L11.402 8.53578L11.532 8.39378C11.728 8.17078 11.742 7.57978 11.84 7.43578C11.938 7.29178 12.134 7.26078 12.33 6.59078C12.526 5.92078 12.765 4.96178 12.513 4.94678C12.451 4.94178 12.381 4.98278 12.308 5.04678C12.352 4.79978 12.446 4.24178 12.467 3.82878C12.495 3.28578 12.405 1.89378 12.096 1.38378C11.903 1.06378 11.513 0.748781 11.126 0.501781C10.9167 0.367746 10.6978 0.249421 10.471 0.147781C9.90503 -0.102219 8.12303 0.0117807 7.51903 0.147781C6.83103 0.301781 6.34903 0.733781 6.04103 1.24378C5.73403 1.75478 5.59703 3.28678 5.62403 3.82978C5.63703 4.07278 5.78303 4.48378 5.82003 4.73478C5.84003 4.86478 5.86003 4.86678 5.87703 4.95978C5.85359 4.95017 5.82834 4.94574 5.80303 4.94678C5.55103 4.96178 5.78903 5.91978 5.98503 6.59078C6.18103 7.26078 6.37603 7.29178 6.47503 7.43578C6.57303 7.57978 6.58703 8.17078 6.78303 8.39378C6.81403 8.42978 6.86103 8.48178 6.92003 8.54378L6.95703 9.01378L7.02303 9.27478C6.99303 9.19978 6.93303 9.15178 6.90603 9.24978L6.65203 10.0188C6.53203 9.92478 6.42203 9.98778 6.32203 10.1538C6.17403 10.4008 5.68403 10.7568 5.11503 11.0138L5.09903 11.0738C5.05556 11.1024 5.00891 11.1259 4.96003 11.1438L1.96003 12.3448C1.31803 12.6018 0.780029 12.6208 0.777029 13.3868L0.280029 15.9998H18.28L17.611 13.3868Z"
                                    fill="black"
                                  />
                                </g>
                              </g>
                              <defs>
                                <clipPath id="clip0_1_489">
                                  <rect
                                    width="16"
                                    height="15"
                                    fill="white"
                                    transform="translate(0.280029)"
                                  />
                                </clipPath>
                                <clipPath id="clip1_1_489">
                                  <rect
                                    width="18"
                                    height="16"
                                    fill="white"
                                    transform="translate(0.280029)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            Client Login
                          </div>

                          <ul className="pl-5">
                            <li className="border-t border-t-[#E9E9E9] w-full pl-[25px]">
                              <Link
                                href="/register"
                                className="text-base py-[25px] pr-[63px] block"
                              >
                                Register
                              </Link>
                            </li>
                            <li className="border-t border-t-[#E9E9E9] w-full pl-[25px]">
                              <Link
                                href="/login"
                                className="text-base py-[25px] pr-[63px] block"
                              >
                                Login
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    let lastScrollPosition = 0;
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;

      if (window.scrollY <= 80) {
        setScrolledDown(false);
        return;
      }

      if (currentScrollPosition > lastScrollPosition) {
        setScrolledDown(true);
      } else {
        setScrolledDown(false);
      }

      lastScrollPosition = currentScrollPosition;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={
        'bg-white z-[1000] transition-all duration-700' +
        (scrolledDown ? ' sticky top-0 ' : '')
      }
    >
      <div className="flex justify-between items-center container">
        <div className="flex">
          <button
            className="h-[24px] w-[24px] bg-[url(/img/menue-bar.svg)] bg-no-repeat bg-center self-center inline md:hidden"
            onClick={() => setOpen(true)}
            type="button"
            aria-label="Open menu"
          />
          <Link href="/">
            <img
              className="ml-[1rem] md:ml-0 h-[29px] my-[20px]"
              src="/logo/logo.svg"
              alt="logo"
            />
          </Link>
        </div>
        <div className="hidden md:block">
          <ul className="flex text-black gap-4">
            <li className="after:content-[''] after:block after:w-0 after:h-[6px] w-fit after:transition-width after:bg-[#3182c1] after:duration-300 hover:after:w-full">
              <a
                href="#portfolio-details"
                className="py-[25px] text-xl font-bold cursor-pointer block"
              >
                About
              </a>
            </li>
            <li className="after:content-[''] after:block after:w-0 after:h-[6px] w-fit after:transition-width after:bg-[#3182c1] after:duration-300 hover:after:w-full">
              <a
                href="https://wa.me/19187801300"
                target="_blank"
                rel="noreferrer"
                className="py-[25px] text-xl font-bold cursor-pointer block"
              >
                Contact Me
              </a>
            </li>
            <li className="after:content-[''] after:block after:w-0 after:h-[6px] w-fit after:transition-width after:bg-[#3182c1] after:duration-300 hover:after:w-full">
              <div className="group/login relative py-[25px] text-xl font-bold flex items-center cursor-pointer">
                <svg
                  className="mr-1"
                  width="17"
                  height="15"
                  viewBox="0 0 17 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_489)">
                    <g clipPath="url(#clip1_1_489)">
                      <path
                        d="M17.611 13.3868C17.608 12.6198 17.071 12.6018 16.428 12.3448L13.428 11.1428C13.3759 11.1223 13.3242 11.1007 13.273 11.0778C12.74 10.8358 12.269 10.4998 12.096 10.2638C12.0825 10.245 12.0699 10.2256 12.058 10.2058C11.964 10.0618 11.883 10.0088 11.815 10.0318C11.717 10.0818 11.733 10.0358 11.7 9.94678C11.619 9.72678 11.485 9.30978 11.464 9.24878C11.433 9.13478 11.349 9.42878 11.368 9.11078L11.402 8.53578L11.532 8.39378C11.728 8.17078 11.742 7.57978 11.84 7.43578C11.938 7.29178 12.134 7.26078 12.33 6.59078C12.526 5.92078 12.765 4.96178 12.513 4.94678C12.451 4.94178 12.381 4.98278 12.308 5.04678C12.352 4.79978 12.446 4.24178 12.467 3.82878C12.495 3.28578 12.405 1.89378 12.096 1.38378C11.903 1.06378 11.513 0.748781 11.126 0.501781C10.9167 0.367746 10.6978 0.249421 10.471 0.147781C9.90503 -0.102219 8.12303 0.0117807 7.51903 0.147781C6.83103 0.301781 6.34903 0.733781 6.04103 1.24378C5.73403 1.75478 5.59703 3.28678 5.62403 3.82978C5.63703 4.07278 5.78303 4.48378 5.82003 4.73478C5.84003 4.86478 5.86003 4.86678 5.87703 4.95978C5.85359 4.95017 5.82834 4.94574 5.80303 4.94678C5.55103 4.96178 5.78903 5.91978 5.98503 6.59078C6.18103 7.26078 6.37603 7.29178 6.47503 7.43578C6.57303 7.57978 6.58703 8.17078 6.78303 8.39378C6.81403 8.42978 6.86103 8.48178 6.92003 8.54378L6.95703 9.01378L7.02303 9.27478C6.99303 9.19978 6.93303 9.15178 6.90603 9.24978L6.65203 10.0188C6.53203 9.92478 6.42203 9.98778 6.32203 10.1538C6.17403 10.4008 5.68403 10.7568 5.11503 11.0138L5.09903 11.0738C5.05556 11.1024 5.00891 11.1259 4.96003 11.1438L1.96003 12.3448C1.31803 12.6018 0.780029 12.6208 0.777029 13.3868L0.280029 15.9998H18.28L17.611 13.3868Z"
                        fill="black"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_1_489">
                      <rect
                        width="16"
                        height="15"
                        fill="white"
                        transform="translate(0.280029)"
                      />
                    </clipPath>
                    <clipPath id="clip1_1_489">
                      <rect
                        width="18"
                        height="16"
                        fill="white"
                        transform="translate(0.280029)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Client Login
                <ul className="absolute overflow-hidden top-0 flex transition-all duration-500 flex-col h-0 group-hover/login:h-[200%] translate-y-[53%] z-[1000] bg-white">
                  {['Register', 'Login'].map((text) => (
                    <li
                      key={text}
                      className="border-t relative border-t-[#E9E9E9] w-full"
                    >
                      <Link
                        href={'/' + text.toLowerCase()}
                        className="py-[25px] pl-[25px] block pr-[63px] text-base"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <MobileMenuSlide open={open} setOpen={setOpen} />
    </div>
  );
};

export default Navbar;
