import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eventops/ui', '@eventops/contracts'],
};

export default nextConfig;
