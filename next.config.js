module.exports = {
  // Remove once we have a better place for the landing page
  rewrites: async () => {
    return [
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) {
      config.optimization.minimize = false;
    }
    config.resolve.fallback = {
      ...config.resolve.fallback, 
      fs: false,
    };
    return config;
  },
};
