import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // Fully static site: every route is prerendered at build time.
  output: 'export',
  images: { unoptimized: true },
};

export default config;
