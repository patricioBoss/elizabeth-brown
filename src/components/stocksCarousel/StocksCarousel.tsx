'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import StockSliderCards from './StockSliderCards';

interface Stock {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  [key: string]: any;
}

interface StocksCarouselProps {
  stocks: any[];
}

const StocksCarousel: React.FC<StocksCarouselProps> = ({ stocks }) => {
  return (
    <div className="w-full h-full">
      <Swiper
        style={{
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {stocks.map((stock) => (
          <SwiperSlide
            className="bg-[#154C8A] rounded-[1rem] overflow-hidden"
            key={stock.symbol}
          >
            <StockSliderCards stockData={stock} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StocksCarousel;
