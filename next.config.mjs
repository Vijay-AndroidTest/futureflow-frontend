/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence Turbopack conflict while we use --webpack
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    // Completely disable persistent caching to avoid 37MB .pack files
    if (config.cache && !dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;