import LandingLayout from 'src/components/landing-layout/LandingLayout';
import HomePageContent from './home-content';
import { getBlogArticles } from '@/lib/articles';
import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}`,
  },
};
export default async function HomePage() {
  const articles = await getBlogArticles();

  return (
    <LandingLayout>
      <HomePageContent initialArticles={articles} />
    </LandingLayout>
  );
}
