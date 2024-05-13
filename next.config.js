/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: "/api/:slug*",
      destination: "https://indexer-dev.foxnb.net/:slug*",
    },
  ];
};

const nextConfig = {
  reactStrictMode: true,
  rewrites,
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true, };
    return config;
  }
}

module.exports = nextConfig
