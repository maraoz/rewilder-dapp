import React from "react";
import NextHead from "next/head";
import { useRouter } from "next/router";

function Head(props) {
  const { children, ...customPageMeta } = props;
  const router = useRouter();

  // Meta values that are the same across all pages
  const globalMeta = {
    siteName: "Rewilder",
    domain: "https://app.rewilder.xyz",
    twitterHandle: "",
  };

  // Default meta values for current page (override with props)
  const defaultPageMeta = {
    title: "Rewilder",
    description:
      "Crypto-native non-profit that coordinates the global purchase of land for wildlife conservation.",
    image: "https://rewilder.xyz/assets/img/social/avatar.png",
    type: "website",
  };

  const meta = { ...globalMeta, ...defaultPageMeta, ...customPageMeta };

  // prettier-ignore
  return (
    <NextHead>
      <title>{meta.title}</title>
      <meta content={meta.description} name="description" key="description" />
      {meta.domain && <link rel="canonical" href={`${meta.domain}${router.asPath}`} key="canonical" />}

      {/* Open Graph */}
      <meta property="og:title" content={meta.title} key="og-title" />
      <meta property="og:description" content={meta.description} key="og-description" />
      <meta property="og:site_name" content={meta.siteName} key="og-site-name" />
      <meta property="og:type" content="website" key="og-type" />
      {meta.domain && <meta property="og:url" content={`${meta.domain}${router.asPath}`} key="og-url" />}
      {meta.image && <meta property="og:image" content={meta.image} key="og-image" />}

      {/* Twitter */}
      <meta name="twitter:title" content={meta.title} key="twitter-title" />
      <meta name="twitter:description" content={meta.description} key="twitter-description"/>
      <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
      {meta.twitterHandle && <meta name="twitter:site" content={meta.twitterHandle} key="twitter-site" />}
      {meta.image && <meta name="twitter:image" content={meta.image} key="twitter-image" />}
    </NextHead>
  );
}

export default Head;
