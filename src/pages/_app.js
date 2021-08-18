import React from "react";
import "./../util/analytics.js";

// TODO: Move to CSS Modules so they are scoped to each component
import "./../styles/global.scss";
import "./../styles/pages/index.scss";
import "./../styles/components/index.scss";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
