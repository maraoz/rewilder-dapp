import { ChainId, getChainName, MULTICALL_ADDRESSES} from "@usedapp/core";
import config from "../config.js"; 


let localhostAddresses, rinkebyAddresses;
try {
  localhostAddresses = require( "../addresses-localhost.json");
} catch (e) {
  console.log("No address file found for localhost.");
}
try {
  rinkebyAddresses = require( "../addresses-rinkeby.json");
} catch (e) {
  console.log("No address file found for rinkeby.");
}

const addresses = {
};
addresses[ChainId.Localhost] = localhostAddresses;
addresses[ChainId.Hardhat] = localhostAddresses;
addresses[ChainId.Rinkeby] = rinkebyAddresses;

// copy multicall addresses from usedapp on production networks
for (const chain of Object.keys(addresses)) {
  if (!addresses[chain]['Multicall']) {
    addresses[chain]['Multicall'] = MULTICALL_ADDRESSES[chain];
  }
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
