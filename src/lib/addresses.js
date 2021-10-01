import { ChainId, getChainName, MULTICALL_ADDRESSES} from "@usedapp/core";
import config from "../config.js"; 


const addresses = {
};
try {
  addresses[ChainId.Localhost] = require( "../addresses-localhost.json");
  addresses[ChainId.Hardhat] = require( "../addresses-localhost.json");
} catch (e) {
  if (process.env.NEXT_PUBLIC_REWILDER_ENV == "dev") {
    console.log("No address file found for localhost.");
  }
}
try {
  addresses[ChainId.Rinkeby] = require( "../addresses-rinkeby.json");
} catch (e) {
  console.log("No address file found for rinkeby.");
}
try {
  addresses[ChainId.Kovan] = require( "../addresses-kovan.json");
} catch (e) {
  console.log("No address file found for kovan.");
}
try {
  addresses[ChainId.Mainnet] = require( "../addresses-mainnet.json");
} catch (e) {
  console.log("No address file found for mainnet.");
}

// copy multicall addresses from usedapp on production networks
for (const chain of Object.keys(addresses)) {
  if (MULTICALL_ADDRESSES[chain]) {
    addresses[chain]['Multicall'] = MULTICALL_ADDRESSES[chain];
  }
}

// add dummy localhost address for production
if (process.env.NEXT_PUBLIC_REWILDER_ENV == "production") {
  addresses[ChainId.Localhost] = addresses[ChainId.Rinkeby];
}


export const addressFor = function(contractName) {
  const chainAddresses = addresses[config.chainId];
  const chainName = getChainName(config.chainId).toLowerCase();
  if (!chainAddresses) {
    throw new Error("No address file found for "+chainName+
    ". Have you run `npx hardhat run scripts/deploy.js --network "+
    chainName+"`?");
  }
  const address = chainAddresses[contractName];
  if (!address) {
    throw new Error("No address found for "+contractName+
    " in "+chainName + " address file.");
  }
  return address;
}
