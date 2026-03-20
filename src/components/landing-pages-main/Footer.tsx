'use client';

import React from 'react';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const social: SocialLink[] = [
  {
    name: 'Twitter',
    href: '#',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'Mail',
    href: 'mailto:elizabethmendebrown@gmail.com',
    icon: (props) => (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M464 80H48a16 16 0 00-16 16v320a16 16 0 0016 16h416a16 16 0 0016-16V96a16 16 0 00-16-16zM265.82 284.63a16 16 0 01-19.64 0L89.55 162.81l19.64-25.26L256 251.73l146.81-114.18 19.64 25.26z" />
      </svg>
    ),
  },
];

interface FooterLink {
  name: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  {
    name: 'Privacy & Cookies',
    href: 'https://docs.google.com/document/d/e/2PACX-1vRAqCJhnytqXdGnoZp8b-Hi-AAdM_r_6_2nAP-6caf5XPK1QiihYOg_ZpX6LbMRs459VO4kUwpO2Ymk/pub',
  },
  {
    name: 'Terms of Use',
    href: 'https://docs.google.com/document/d/e/2PACX-1vRAqCJhnytqXdGnoZp8b-Hi-AAdM_r_6_2nAP-6caf5XPK1QiihYOg_ZpX6LbMRs459VO4kUwpO2Ymk/pub',
  },
  {
    name: 'Contact Us',
    href: 'https://wa.me/19187801300',
  },
];

const Footer: React.FC = () => {
  return (
    <div className="bg-[#F2F2F2] py-[45px]">
      <div className="container">
        <div className="flex justify-center gap-3 pb-[45px] border-b border-b-[#CCCCCC]">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-[#666666] hover:text-[#3c3c3c] ml-4"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="flex justify-center pt-[47px] gap-6">
          {footerLinks.map(({ name, href }) => (
            <a
              key={name}
              target="_blank"
              href={href}
              rel="noreferrer"
              className="text-sm text-[#666666]"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
