import { ChainId, getChainName } from "@usedapp/core";

const INFURA_ID = "cea7dccbc1994ce1a585d6f06eda519b";

module.exports.chainId = ChainId.Localhost;
if (process.env.REWILDER_ENV == "production") {
  module.exports.chainId = ChainId.Rinkeby;
}
module.exports.networkName = getChainName(module.exports.chainId).toLowerCase();

module.exports.INFURA_ID = INFURA_ID;
module.exports.config = {
  readOnlyChainId: module.exports.chainId,
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: "http://localhost:8545",
    [ChainId.Localhost]: "http://localhost:8545",
  },
  supportedChains: [
    //hainId.Mainnet,
    //ChainId.Goerli,
    //ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    //ChainId.xDai,
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
