const withPlugins = require("next-compose-plugins");
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true" ? true : false,
// });
const withPWA = require("next-pwa");
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: true,
  images: {
    domains: ["localhost", "avatars.dicebear.com", "course-lab.xyz"],
  },
  swcMinify: true,
  experimental: { optimizeCss: true },
  poweredByHeader: false,
  pwa: {
    dest: "public",
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};

module.exports = withPlugins([withPWA], nextConfig);
