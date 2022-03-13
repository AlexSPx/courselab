module.exports = {
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
};
