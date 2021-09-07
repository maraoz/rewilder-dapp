import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./../lib/analytics.js";
import { config } from "../config.js";

export const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  return (
    <DAppProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.reactQueryState}>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </DAppProvider>
  );
};

export default MyApp;
