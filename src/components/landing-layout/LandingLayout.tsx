'use client';

import React, { ReactNode } from 'react';
import Footer from 'src/components/landing-pages-main/Footer';
import Navbar from 'src/components/landing-pages-main/Navbar';
import RandomToast from 'src/components/RandomToast';
import WhatsappFloatButton from 'src/components/WhatsappFloatButton';

interface LandingLayoutProps {
  children: ReactNode;
  isSticky?: boolean;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="relative bg-[#F2F2F2]">
      <Navbar />
      {children}
      <RandomToast />
      <WhatsappFloatButton />
      <Footer />
    </div>
  );
};

export default LandingLayout;
