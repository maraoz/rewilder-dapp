import {
  useDisclosure,
} from "@chakra-ui/react";

import ConnectWalletModal from "./ConnectWalletModal";

function ConnectWallet() {

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <div class="header-button">
          <a href="#" onClick={onOpen}>Connect wallet</a>
      </div>
      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>
    </>
  );
}

export default ConnectWallet;
