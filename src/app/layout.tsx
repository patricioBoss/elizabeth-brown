// Tailwind CSS & SCSS
import 'src/styles/globals.scss';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// toastify
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
// scripts
import Script from 'next/script';

// react-quill
import 'react-quill/dist/quill.snow.css';

// tiny-slider
import 'tiny-slider/dist/tiny-slider.css';

// ----------------------------------------------------------------------

// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import Providers from 'src/components/providers/Providers';
import MotionLazy from 'src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from 'src/components/settings';
// contexts
import { CollapseDrawerProvider } from 'src/contexts/CollapseDrawerContext';

// ----------------------------------------------------------------------

import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Elizabeth Mende Brown';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Financial Advisor | Family Wealth Advisor`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Elizabeth Mende Brown: Expert guidance for secure financial futures. Specializing in Retirement, Investing, Family Wealth, Business Planning, Philanthropy, and Financial Wellness.',
  keywords: [
    'Elizabeth Mende Brown',
    'Elizabeth Brown',
    'Mende Brown',
    'Financial Advisor',
    'Wealth Management',
    'Retirement Planning',
    'Family Wealth',
    'Business Planning',
    'Philanthropy',
    'Financial Wellness',
    'Investment Management',
    'elizabethmendebrown',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    title: `${SITE_NAME} | Financial Advisor`,
    description:
      'Elizabeth Mende Brown: Expert guidance for secure financial futures. Specializing in Retirement, Investing, Family Wealth, Business Planning, and Financial Wellness.',
    url: SITE_URL,
    images: [
      {
        url: '/assets/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Financial Advisor`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@elizabethmendebrown',
    creator: '@elizabethmendebrown',
    title: `${SITE_NAME} | Financial Advisor`,
    description:
      'Expert guidance for secure financial futures. Specializing in Retirement, Investing, Family Wealth, and Business Planning.',
    images: ['/assets/images/og-default.jpg'],
  },
  manifest: '/manifest.json',
  icons: [{ rel: 'icon', url: 'favicon.ico' }],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <Script src="/js/easy_background.js" strategy="beforeInteractive" />
        <Script src="/js/feather.min.js" strategy="beforeInteractive" />
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light',
            themeDirection: 'ltr',
            themeContrast: 'default',
            themeLayout: 'vertical',
            themeColorPresets: 'blue',
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <MotionLazy>
              <CollapseDrawerProvider>
                <SettingsDrawer />
                <Providers>{children}</Providers>
                <ToastContainer
                  position="top-right"
                  autoClose={4000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  theme="colored"
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </CollapseDrawerProvider>
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
        <Script id="feather-replace">{`feather.replace();`}</Script>
      </body>
    </html>
  );
}
