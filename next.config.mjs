/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // This ensures modern builds don't get stuck on old cache files
    webpack: (config, { dev }) => {
        if (config.cache && !dev) {
            config.cache = false;
        }
        return config;
    },
};

export default nextConfig;