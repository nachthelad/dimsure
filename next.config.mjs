/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/blog/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [];
  },
};

export default nextConfig;
