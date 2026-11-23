module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    ...(process.env.GOOGLE_SERVICES_JSON_PATH
      ? { googleServicesFile: process.env.GOOGLE_SERVICES_JSON_PATH }
      : {}),
  },
  ios: {
    ...config.ios,
    ...(process.env.GOOGLE_SERVICE_INFO_PLIST_PATH
      ? { googleServicesFile: process.env.GOOGLE_SERVICE_INFO_PLIST_PATH }
      : {}),
  },
  plugins: [
    ...(config.plugins || []),
   
  ],
});
