'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsappFloatButtonProps {
  cellphoneNumber?: string;
}

const WhatsappFloatButton: React.FC<WhatsappFloatButtonProps> = () => {
  return (
    <div>
      <a
        style={{ color: 'white' }}
        href="https://api.whatsapp.com/send/?phone=14242793916&text=Hello,%20i%20am%20interested%20in%20the%20services%20provided%20by%20Elizabeth%20Mende%20Brown%20and%20would%20like%20to%20know%20more."
        className="fixed w-[70px] h-[70px] bottom-[22px] left-[40px] bg-green-500 text-white rounded-full text-center text-[40px] shadow-md z-10 flex justify-center items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default WhatsappFloatButton;
