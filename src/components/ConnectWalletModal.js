import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { walletconnect } from "../lib/connectors";

function ConnectWalletModal({ onOpen, isOpen, onClose }) {
  const { activate, activateBrowserWallet } = useEthers();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect to a wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              rightIcon={
                <Image
                  maxWidth="20px"
                  src="/images/logo-metamask.png"
                  alt="MetaMask"
                />
              }
              onClick={() => {
                activateBrowserWallet();
              }}
            >
              MetaMask
            </Button>
            <Button
              justifyContent="space-between"
              width="100%"
              mb="4"
              size="lg"
              variant="outline"
              rightIcon={
                <Image
                  maxWidth="20px"
                  src="/images/logo-walletconnect.svg"
                  alt="WalletConnect"
                />
              }
              onClick={() => {
                activate(walletconnect);
              }}
            >
              WalletConnect
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConnectWalletModal;
