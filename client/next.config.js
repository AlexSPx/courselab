const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true" ? true : false,
});
const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["localhost", "avatars.dicebear.com", "course-lab.xyz"],
  },
  swcMinify: true,
  experimental: { optimizeCss: true },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  poweredByHeader: false,
  pwa: {
    dest: "public",
  },
});
