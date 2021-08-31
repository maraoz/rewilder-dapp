module.exports = {
  // Remove once we have a better place for the landing page
  rewrites: async () => {
    return [
      {
        source: "/landing-page",
        destination: "/landing-page/index.html",
      },
    ];
  },
};
