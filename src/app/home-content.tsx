'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// Components
import Hero from 'src/components/landing-pages-main/Hero';
import Testimonials from 'src/components/landing-pages-main/Testimonials';
import LandingLayout from 'src/components/landing-layout/LandingLayout';
import AboutSection from 'src/components/landing-pages-main/AboutSection';
import Services, { PortfolioCTA } from 'src/components/landing-pages-main/Services';
import BlogList1 from 'src/components/landing-pages-main/BlogList1';
import MorganBlogs from 'src/components/landing-pages-main/MorganBlogs';
import CTAsection from 'src/components/landing-pages-main/CTAsection';
import FAQs from 'src/components/landing-pages-main/FAQs';
import Script from 'next/script';

interface HomePageContentProps {
  initialArticles: {
    id: number | string;
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    intro: {
      title: string;
      exp: string;
      outlines: string[];
      moreLink: string;
    };
  }[];
}

const HomePageContent: React.FC<HomePageContentProps> = ({ initialArticles }) => {
  const mounted = useRef(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles] = React.useState(initialArticles);

  useEffect(() => {
    const ref = searchParams?.get('ref');

    if (mounted.current && ref) {
      axios
        .get('/api/user/' + ref)
        .then((res) => {
          console.log(res.data.data);
          localStorage.setItem('ref', JSON.stringify(res.data.data));
        })
        .catch((err) => {
          console.error(err);
        });
    }
    mounted.current = false;
  }, [searchParams]);

  return (
    <>
      <Hero />
      <AboutSection />
      <Services />
      <PortfolioCTA />
      <BlogList1 list={articles} />
      <MorganBlogs />
      <CTAsection />
      <FAQs />
      <Testimonials />
      <Script id="easy-bg-init" strategy="lazyOnload">
        {`
          if (typeof easy_background !== 'undefined') {
            easy_background("#home",
              {
                slide: ["/assets/images/bg/1.jpg", "/assets/images/bg/2.jpg", "/assets/images/bg/3.jpg"],
                delay: [4000, 4000, 4000]
              }
            );
          }
        `}
      </Script>
    </>
  );
};

export default HomePageContent;
