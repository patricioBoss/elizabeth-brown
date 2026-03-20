// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Investment Plans',
//   description:
//     'Explore investment plans with Elizabeth Mende Brown. Choose from fixed-return plans, crypto, real estate, and stock market opportunities designed to grow your wealth.',
//   keywords: [
//     'investment plans',
//     'fixed returns',
//     'wealth management',
//     'portfolio diversification',
//     'passive income',
//     'Elizabeth Mende Brown',
//   ],
//   openGraph: {
//     title: 'Investment Plans | Elizabeth Mende Brown',
//     description:
//       'Explore fixed-return plans, crypto, real estate, and stock market opportunities designed to grow your wealth.',
//     url: 'https://advisor.elizabethmendebrown.com/invest',
//   },
//   alternates: { canonical: 'https://advisor.elizabethmendebrown.com/invest' },
// };

export default function InvestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
