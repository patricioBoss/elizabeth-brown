/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "https://s3-symbol-logo.tradingview.com",
      "pipsville-bucket.s3.us-west-004.backblazeb2.com",
      "assets.coingecko.com",
      "coin-images.coingecko.com",
      "archive.businessday.ng",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archive.businessday.ng',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Increase static page generation timeout
  staticPageGenerationTimeout: 180,
};

module.exports = nextConfig;
