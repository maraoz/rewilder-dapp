import { useEthers } from "@usedapp/core";
import config from "../config";

function networkMatches () {
  const { error, chainId } = useEthers();
  const incorrectNetwork = error && error.name == 'UnsupportedChainIdError' || 
  (chainId && chainId != config.chainId);

  return !incorrectNetwork;
}

export default networkMatches;
