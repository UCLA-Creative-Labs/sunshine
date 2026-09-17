/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },

  async redirects() {
    return [
      { source: '/', destination: '/portal', permanent: false },
      ...['about', 'join', 'team', 'projects'].map((p) => ({
        source: `/${p}/:path*`,
        destination: `https://www.creativelabsucla.com/${p}/:path*`,
        permanent: true,
      })),
    ];
  },

  turbopack: {},

  experimental: {
    // Next.js 16.3 saves a Turbopack build cache that holds env values. The Netlify secret scan fails on it.
    turbopackFileSystemCacheForBuild: false,
  },

  env: {
    SPACE_ID: process.env.SPACE_ID,
    CDN_API_KEY: process.env.CDN_API_KEY,
  },
};

module.exports = nextConfig