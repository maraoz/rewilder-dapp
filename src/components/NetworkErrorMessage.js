import { getChainName } from "@usedapp/core";
import { useEthers } from "@usedapp/core";
import config from "../config";

function NetworkErrorMessage () {

  const { error, chainId} = useEthers();
  const incorrectNetwork = error && error.name == 'UnsupportedChainIdError' || 
  (chainId && chainId != config.chainId);

  return (
    <div>
      {
        incorrectNetwork && 
          <div className="alert" status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Network selected in wallet ({getChainName(chainId)}, id: {chainId}) unsupported,
              please change to {config.networkName}.</AlertTitle>
          </div>
      }
    </div>
  );
}

export default NetworkErrorMessage ;
