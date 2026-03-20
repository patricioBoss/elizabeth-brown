/**
 * Article data source switcher.
 *
 * Set USE_LOCAL_ARTICLES=true in .env.local to use local JSON fallback.
 * When unset (or false) the live WordPress API is used.
 */

import axios from 'axios';
import localArticles from '@/data/articles.json';

const WP_BASE = 'https://archive.businessday.ng';
const USE_LOCAL = process.env.USE_LOCAL_ARTICLES === 'true';

// -----------------------------------------------------------------------

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

const introData = [
  {
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
  {
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
];

// -----------------------------------------------------------------------
// Helpers

async function fetchImageUrl(mediaId: number): Promise<string> {
  const { data } = await axios.get(`${WP_BASE}/wp-json/wp/v2/media/${mediaId}`);
  return data.source_url as string;
}

async function wpPostToArticle(post: any, index: number): Promise<Article & { status: string; type: string; intro: (typeof introData)[0] }> {
  const image = await fetchImageUrl(post.featured_media);
  return {
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/\n?<p>\[&hellip;\]<\/p>\n?$/, '...<\/p>'),
    content: post.content.rendered,
    image,
    date: post.date,
    status: post.status,
    type: post.type,
    intro: introData[index] || introData[0],
  };
}

// -----------------------------------------------------------------------
// Public API

/** Returns all articles for the home page blog list. */
export async function getBlogArticles() {
  if (USE_LOCAL) {
    return localArticles.map((a, i) => ({
      ...a,
      status: 'publish',
      type: 'post',
      intro: introData[i] || introData[0],
    }));
  }

  try {
    const { data } = await axios.get(`${WP_BASE}/wp-json/wp/v2/posts`, {
      params: { include: '290943,290481' },
    });
    return Promise.all(data.map((post: any, i: number) => wpPostToArticle(post, i)));
  } catch (err) {
    console.error('WP API error — falling back to local articles:', err);
    return localArticles.map((a, i) => ({
      ...a,
      status: 'publish',
      type: 'post',
      intro: introData[i] || introData[0],
    }));
  }
}

/** Returns a single article by slug. */
export async function getArticle(slug: string): Promise<Article | null> {
  if (USE_LOCAL) {
    return localArticles.find((a) => a.slug === slug) || null;
  }

  try {
    const { data } = await axios.get(`${WP_BASE}/wp-json/wp/v2/posts`, {
      params: { slug },
    });
    if (!data || data.length === 0) return null;
    const post = data[0];
    const image = await fetchImageUrl(post.featured_media);
    return {
      id: post.id,
      slug: post.slug,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      content: post.content.rendered,
      image,
      date: post.date,
    };
  } catch (err) {
    console.error('WP API error — falling back to local articles:', err);
    return localArticles.find((a) => a.slug === slug) || null;
  }
}

/** Returns slugs for generateStaticParams. */
export async function getArticleSlugs(): Promise<{ slug: string }[]> {
  if (USE_LOCAL) {
    return localArticles.map((a) => ({ slug: a.slug }));
  }

  try {
    const { data } = await axios.get(`${WP_BASE}/wp-json/wp/v2/posts`, {
      params: { include: '290943,290481' },
    });
    return data.map((post: any) => ({ slug: post.slug }));
  } catch (err) {
    console.error('WP API error — falling back to local slugs:', err);
    return localArticles.map((a) => ({ slug: a.slug }));
  }
}
