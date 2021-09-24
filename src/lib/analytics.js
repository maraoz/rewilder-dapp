import Router from "next/router";
import GA4React from "ga-4-react";


if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
) {
  const GA = new GA4React(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
    debug_mode: !process.env.production,
  });

  GA.initialize().then(
    (ga) => {
      ga.pageview(window.location.pathname);

      Router.events.on("routeChangeComplete", () => {
        ga.pageview(window.location.pathname);
      });
    },
    (err) => {
      console.error(err);
    }
  );
}
