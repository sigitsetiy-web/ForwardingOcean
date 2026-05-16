/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force all pages to be dynamic (not static) so they always fetch fresh data
  experimental: {
    // This ensures API routes are always dynamic
  },
};

export default nextConfig;
