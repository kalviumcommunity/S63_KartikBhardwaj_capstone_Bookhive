/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['covers.openlibrary.org', 'localhost', 'bookhiveee.netlify.app'],
  },
  async rewrites() {
    return [
      {
        source: '/api/openlibrary/:path*',
        destination: 'https://openlibrary.org/:path*',
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;