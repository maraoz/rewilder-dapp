import { Text } from "@chakra-ui/react";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { utils } from "ethers";

function Balance() {
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const finalBalance = etherBalance ? utils.formatEther(etherBalance) : "";

  return <Text>{finalBalance} ETH</Text>;
}

export default Balance;
