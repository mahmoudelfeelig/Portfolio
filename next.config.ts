import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.elfeel.me',
          },
        ],
        destination: 'https://elfeel.me/:path*',
        permanent: true,
      },
    ];
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
