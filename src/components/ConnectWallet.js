import {
  useDisclosure,
} from "@chakra-ui/react";

import ConnectWalletModal from "./ConnectWalletModal";

function ConnectWallet() {

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
      <span className="text-right order-1 order-md-last fs-14 mr-20">
        <button onClick={onOpen} className="btn btn-custom btn-outline-none">
          Connect wallet
        </button>
      </span>
      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>
    </>
  );
}

export default ConnectWallet;
