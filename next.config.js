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

    env: {
      SPACE_ID: process.env.SPACE_ID,
      CDN_API_KEY: process.env.CDN_API_KEY,
    },
  };

  module.exports = nextConfig