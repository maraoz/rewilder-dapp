import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { DAppProvider } from "@usedapp/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./../lib/analytics.js";
import config from "../config.js";
import { addressFor } from "../lib/addresses";

// required for dev networks
config.DAppProviderConfig.multicallAddresses[config.chainId] = addressFor,("Multicall")

export const queryClient = new QueryClient();

// TODO: delete this message for prod
console.log(`Configuring app in ${config.networkName} network.`)

const MyApp = ({ Component, pageProps }) => {
  return (
    <DAppProvider config={config.DAppProviderConfig}>
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
