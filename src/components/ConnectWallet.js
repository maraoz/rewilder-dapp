import {
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import ConnectWalletModal from "./ConnectWalletModal";

function ConnectWallet() {

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        order={[-1, null, null, 2]}
        textAlign={["left", null, null, "right"]}
      >
        <Button colorScheme="teal" variant="outline" onClick={onOpen}>
          Connect Wallet
        </Button>
      </Box>
      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>
    </>
  );
}

export default ConnectWallet;
