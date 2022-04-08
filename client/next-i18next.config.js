const i18nextHttpBackend = require("i18next-http-backend/cjs");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "bg"],
  },
  // use: process.browser ? [i18nextHttpBackend] : [],
};
