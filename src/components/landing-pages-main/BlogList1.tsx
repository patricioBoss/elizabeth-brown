'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface BlogIntro {
  title: string;
  exp: string;
  outlines: string[];
  moreLink: string;
}

interface BlogArticle {
  intro: BlogIntro;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  id: string | number;
}

interface BlogTemplateProps {
  article: BlogArticle;
  index: number;
}

const blogList: { intro: BlogIntro }[] = [
  {
    intro: {
      title: 'Cryptocurrency',
      exp: 'Working with you to understand your life goals and develop a personalized wealth strategy. Today and for the years to come.',
      outlines: [
        '401(k) Rollovers',
        'Wealth Accumulation Plans',
        'Financial Independence',
        'Diversification',
        'Passive Income Generation',
        'Global Accessibility',
      ],
      moreLink: '#',
    },
  },
  {
    intro: {
      title: 'Forex Trade',
      exp: 'Provides an opportunity to break free from the limitations of traditional employment and achieve financial independence.',
      outlines: [
        'Capital Growth',
        'Wealth Accumulation Plans',
        'Portfolio Diversification',
        'Passive Income Generation',
        'Global Market Exposure',
        'Lifestyle Flexibility',
      ],
      moreLink: '#',
    },
  },
  {
    intro: {
      title: 'Stock Market',
      exp: 'By carefully selecting stocks of well-established companies with strong growth potential, investors can witness the value of their investments grow over time',
      outlines: [
        'Wealth Accumulation Plans',
        'Financial Independence',
        'Diversification',
        'Passive Income Generation',
        'Retirement Planning',
        'Financial Empowerment',
      ],
      moreLink: '#',
    },
  },
];

const BlogTemplate: React.FC<BlogTemplateProps> = ({ article, index }) => (
  <div className="border-b border-b-[#CCCCCC] py-[30px]">
    <div className="md:flex text-base text-black md:min-h-[390px]">
      <div className="md:w-[38%]">
        <h3 className="text-[28px] text-[#0F8EC7] mb-[29px]">
          {blogList[index]?.intro.title || 'Investment'}
        </h3>
        <p className="">{blogList[index]?.intro.exp || ''}</p>
        <ul className="mt-4 mb-[35px] list-disc pl-6">
          {(blogList[index]?.intro.outlines || []).map((item) => (
            <li key={item} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
        <div className="mb-9">
          <Link
            href={`/articles/${article.slug}`}
            className="py-[16px] px-[52px] cursor-pointer rounded-full text-[19px] text-[#666666] border-2 border-[#666666] font-bold hover:bg-[#666666] hover:text-white"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className="relative md:w-[62%] bg-[#fff] flex flex-col md:flex-row">
        <Link
          href={`/articles/${article.slug}`}
          className="absolute transition-all duration-500 top-0 left-0 right-0 bottom-0 bg-[#4c4c4c] opacity-0 hover:opacity-20"
        />
        <div className="md:w-1/2 p-[30px] order-2 md:order-1 text-black">
          <h3 className="text-[24px] font-bold mb-[30px]">
            {article.title.toUpperCase()}
          </h3>
          <div
            className="text-base"
            dangerouslySetInnerHTML={{ __html: article.excerpt }}
          />
        </div>
        <div className="relative pt-[130%] order-1 md:order-2 md:pt-0 md:w-1/2">
          <Image
            src={article.image}
            fill
            className="object-cover object-center"
            alt={article.title}
          />
        </div>
      </div>
    </div>
  </div>
);

interface BlogList1Props {
  list: BlogArticle[];
}

const BlogList1: React.FC<BlogList1Props> = ({ list }) => {
  return (
    <div id="thought-list" className="container my-[45px]">
      {list.map((article, index) => (
        <BlogTemplate key={article.id} index={index} article={article} />
      ))}
    </div>
  );
};

export default BlogList1;
