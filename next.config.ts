import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/telemetry/:path*',
        destination: 'https://cloud.umami.is/:path*',
      },
    ];
  },
};

export default nextConfig;
