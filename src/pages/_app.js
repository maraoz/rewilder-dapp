import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ChainId, DAppProvider, MULTICALL_ADDRESSES } from "@usedapp/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./../lib/analytics.js";

export const queryClient = new QueryClient();

export const INFURA_ID = "cea7dccbc1994ce1a585d6f06eda519b";

const config = {
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: "http://localhost:8545",
    [ChainId.Localhost]: "http://localhost:8545",
  },
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  /*
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
    [ChainId.Hardhat]: MulticallContract,
    [ChainId.Localhost]: MulticallContract,
  },
  */
};

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
