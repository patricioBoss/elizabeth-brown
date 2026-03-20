'use client';

import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import 'tiny-slider/dist/tiny-slider.css';
import Image from 'next/image';

interface Review {
  title: string;
  img: string;
  body: string;
  author: string;
  rating: number;
}

const reviews: Review[] = [
  {
    title: 'Tailored Financial Guidance',
    img: '/assets/images/client/01.jpg',
    body: "Elizabeth Brown took the time to understand my unique financial needs and crafted a personalized wealth management plan that perfectly aligns with my long-term goals.",
    author: 'Daniel K',
    rating: 4,
  },
  {
    title: 'Exceptional Service',
    img: '/assets/images/Ashley Rodriguez.jpg',
    body: "Elizabeth Brown truly understands my investment objectives and has consistently offered insightful financial advice. Her professionalism has had a remarkable effect on my portfolio's growth.",
    author: 'Ashley R',
    rating: 4,
  },
  {
    title: 'Unmatched Financial Expertise',
    img: '/assets/images/client/02.jpg',
    body: "Elizabeth Brown's depth of knowledge in wealth management is unmatched. Her guidance has been pivotal in helping me grow and safeguard my investments.",
    author: 'Amanda B',
    rating: 5,
  },
  {
    title: 'Beyond Expectations',
    img: '/assets/images/loreta Afonso.jpg',
    body: "I can't recommend Elizabeth Brown enough for business planning. Her strategic approach helped me optimize my finances, leading to increased profits and business growth.",
    author: 'Loreta A',
    rating: 5,
  },
  {
    title: 'Confidence in My Finances',
    img: '/assets/images/client/sara.jpg',
    body: "Elizabeth Brown's advice has given me complete confidence in my financial future. She helped me create a diversified portfolio and provided smart tax-saving strategies.",
    author: 'Sara M',
    rating: 4,
  },
  {
    title: 'Debt-Free and Thriving!',
    img: '/assets/images/caroline.png',
    body: "Thanks to Elizabeth Brown's financial wellness program, I've eliminated my debt and gained better control over my finances. Her advice has transformed my financial outlook.",
    author: 'Caroline M',
    rating: 4,
  },
  {
    title: 'Strategic Wealth Growth',
    img: '/assets/images/client/06.jpg',
    body: "Elizabeth Brown's expert advice has been instrumental in expanding my wealth. Her recommendations are always on point, and I've seen consistent financial growth under her guidance.",
    author: 'James B',
    rating: 5,
  },
  {
    title: 'Comprehensive Portfolio Management',
    img: '/assets/images/peter.jpg',
    body: "Elizabeth Brown's portfolio management skills are exceptional. Her insights have helped me make informed decisions, and I trust her completely with my financial strategy.",
    author: 'Peter D',
    rating: 5,
  },
  {
    title: 'Guidance You Can Trust',
    img: '/assets/images/client/03.jpg',
    body: "Elizabeth Brown has been a trusted advisor, guiding me through complex financial decisions with clarity. Her support has been key in achieving my financial milestones.",
    author: 'Sophia L',
    rating: 5,
  },
];

const settings = {
  container: '.tiny-two-item',
  controls: true,
  mouseDrag: true,
  loop: true,
  rewind: true,
  autoplay: true,
  autoplayButtonOutput: false,
  autoplayTimeout: 3000,
  navPosition: 'bottom',
  controlsText: [
    '<svg stroke="currentColor" class="h-4 w-4 m-auto" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>',
    '<svg stroke="currentColor" class="h-4 w-4 m-auto" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>',
  ],
  nav: false,
  speed: 400,
  gutter: 0,
  responsive: {
    768: {
      items: 2,
    },
  },
};

interface StarIconProps {
  className?: string;
}

function StarIcon(props: StarIconProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const Testimonials: React.FC = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      require('tiny-slider/src/tiny-slider').tns(settings);
    }
    isMounted.current = false;
  }, []);

  return (
    <section className="relative md:py-24 py-16 bg-zinc-50" id="testi">
      <div className="container">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h6 className="text-[#0F8EC7] text-base font-medium uppercase mb-2">
            Testimonial
          </h6>
          <h3 className="mb-4 md:text-2xl text-xl font-medium">
            Client&apos;s Review
          </h3>
        </div>

        <div className="grid grid-cols-1 mt-8 relative">
          <div className="tiny-two-item">
            {reviews.map(({ author, body, rating, img }, idx) => (
              <div key={idx} className="tiny-slide">
                <div className="lg:flex p-6 lg:p-0 relative rounded-md shadow shadow-slate-200 bg-white overflow-hidden m-2">
                  <Image
                    className="w-24 h-24 lg:w-48 lg:h-auto lg:rounded-none rounded-full mx-auto object-cover object-center"
                    src={img}
                    alt=""
                    width={384}
                    height={512}
                  />
                  <div className="pt-6 lg:p-6 text-center lg:text-left space-y-4">
                    <p className="text-base text-slate-500">{body}</p>

                    <div>
                      <span className="text-[#0F8EC7] block mb-1">
                        {author}
                      </span>
                      <span className="flex justify-center lg:justify-start">
                        {Array.from({ length: 5 }, (_, index) => (
                          <StarIcon
                            key={index}
                            className={clsx(
                              'h-5 w-5',
                              rating > index
                                ? 'fill-orange-300'
                                : 'fill-gray-300'
                            )}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
