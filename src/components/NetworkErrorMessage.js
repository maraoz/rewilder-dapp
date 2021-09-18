import { getChainName } from "@usedapp/core";
import { useEthers } from "@usedapp/core";
import config from "../config";
import networkMatches from "../lib/networkMatches";

function NetworkErrorMessage () {

  const { chainId } = useEthers();
  const incorrectNetwork = !networkMatches();

  return (
    <div>
      {
        incorrectNetwork && 
            <div className="alert" status="error">
              <div mr={2}>Network selected in wallet 
                ({getChainName(chainId)}, id: {chainId})
                is not supported, please change to {config.networkName}.</div>
            </div>
      }
    </div>
  );
}

export default NetworkErrorMessage;
