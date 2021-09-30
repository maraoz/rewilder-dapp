import { ChainId, getChainName, MULTICALL_ADDRESSES} from "@usedapp/core";

const INFURA_ID = "cea7dccbc1994ce1a585d6f06eda519b";

module.exports.chainId = ChainId.Localhost;

if (process.env.NEXT_PUBLIC_REWILDER_ENV == "production") {
  // TODO: change to mainnet
  module.exports.chainId = ChainId.Rinkeby;
}
if (process.env.NEXT_PUBLIC_REWILDER_ENV == "staging") {
  module.exports.chainId = ChainId.Rinkeby;
}
if (process.env.NEXT_PUBLIC_REWILDER_ENV == "production" ||
    process.env.NEXT_PUBLIC_REWILDER_ENV == "staging") {
  // add dummy Multicall address to prevent @usedapp trying to deploy a new one
  MULTICALL_ADDRESSES[ChainId.Localhost] = MULTICALL_ADDRESSES[ChainId.Rinkeby];
}
module.exports.networkName = getChainName(module.exports.chainId).toLowerCase();

module.exports.INFURA_ID = INFURA_ID;
module.exports.DAppProviderConfig = {
  readOnlyChainId: module.exports.chainId,
  readOnlyUrls: {
    [ChainId.Mainnet]: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Rinkeby]: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: "http://localhost:8545",
    [ChainId.Localhost]: "http://localhost:8545",
  },
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
  },
};
