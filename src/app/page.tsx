import LandingLayout from 'src/components/landing-layout/LandingLayout';
import HomePageContent from './home-content';
import { getBlogArticles } from '@/lib/articles';

export default async function HomePage() {
  const articles = await getBlogArticles();

  return (
    <LandingLayout>
      <HomePageContent initialArticles={articles} />
    </LandingLayout>
  );
}
