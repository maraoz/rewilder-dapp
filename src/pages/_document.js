import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    // prettier-ignore
    return (
      <Html lang="en">
        <Head>
          {/* favicon */}
          <link rel="shortcut icon" href="/favicon.png" />
          
          <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png"/>
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/safari-pinned-tab.svg" rel="mask-icon" color="#4a9885" />
          <link href="/site.webmanifest" rel="manifest" />

          <link rel="stylesheet" href="/assets/css/airbnb-font.css"/>
          <link rel="stylesheet" href="/assets/css/bootstrap.min.css"/>
          <link rel="stylesheet" href="/assets/css/main.css"/>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
