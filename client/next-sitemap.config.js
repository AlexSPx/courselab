const siteUrl = "https://course-lab.xyz";

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  exclude: [`${siteUrl}/server-sitemap.xml`],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSItemaps: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/server-sitemap.xml`,
    ],
  },
};
