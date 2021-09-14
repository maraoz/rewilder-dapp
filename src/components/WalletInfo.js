import {
  Box,
  Image,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Flex
} from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import Identicon from 'react-identicons';
import { useEthers, useEtherBalance } from "@usedapp/core";
import React from "react";
import truncateHash from "../lib/truncateHash";

function WalletInfo() {
  const { account, deactivate } = useEthers();
  const etherBalance  = useEtherBalance(account);
  const size = 20;
  const palette = ["#158D0C", "#3F6947", "#339645"];
  return (
    account && (
    <Flex 
      order={[-1, null, null, 2]}
      justifyContent={["flex-end", null, null, "flex-end"]}
      >
        <Flex
          borderRadius="xl"
          alignItems="center"
          background="gray.200"
        >
        <Menu placement="bottom-end" >
          <Box px="3">
            <Text fontSize="md">
              {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
            </Text>
          </Box>
          <MenuButton as={Button} borderRadius="xl">
            <Flex
            alignItems="center"
            >
            {truncateHash(account)}
            <Identicon className="canvas" palette={palette} string={account} size={size} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                deactivate();
              }}
              >
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
    )
  );
}

export default WalletInfo;
