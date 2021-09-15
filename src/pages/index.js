import React, { useState, useEffect } from "react";
import Router from 'next/router'
import { Button, Box, useDisclosure} from "@chakra-ui/react";
import { useEthers, useContractFunction } from "@usedapp/core";
import Slider from "@material-ui/core/Slider";
import Layout from "./../components/Layout";
import { addressFor } from "../lib/addresses";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import ConnectWalletModal from "../components/ConnectWalletModal";
import { ethers } from 'ethers';
import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";

function IndexPage() {
  const { account, error, library } = useEthers();
  const { onOpen, isOpen, onClose } = useDisclosure();
  
  const [amount, setAmount] = useState(1);
  const [walletOpened, setWalletOpened] = useState(false);
  
  const clamp = (n, lower, upper) => Math.min(Math.max(n, lower), upper);
  
  const RewilderDonationCampaignInterface = new ethers.utils.Interface(RewilderDonationCampaign.abi)
  const campaignAddress = addressFor("RewilderDonationCampaign");
  const campaign = new ethers.Contract(
    campaignAddress,
    RewilderDonationCampaignInterface,
  );
  
  const { state: donateTx , events, send: requestDonateToWallet } =
    useContractFunction(campaign, "donate", { transactionName: 'Donate' });
    
  const maybeBalance = useBalanceOf(account);
  const balance = maybeBalance && maybeBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, balance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  
  const alreadyDonated = donateTx.status=="Success" || balance > 0;
    
  useEffect(() => {
    if (error) {
      console.log(`error`, error);
    }
  }, [error]);
  
  const redirectDelayMS = 2000;
  useEffect(() => {
    if (events) {
      const tokenId = events[0].args[2].toNumber();
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      setTimeout(() => {
        Router.push(`/nft/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [events]);
  useEffect(() => {
    if (balance > 0 && tokenId) {
      console.log(`balance=${balance}, tokenId=${tokenId}. redirecting in ${redirectDelayMS}ms...`);
      setTimeout(() => {
        Router.push(`/nft/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [balance, tokenId]);
  useEffect(() => {
    if (donateTx.status == 'Exception' || 
        donateTx.status == 'Mining'
        ) {
      setWalletOpened(false);
    }
  }, [donateTx]);
  const handleSliderChange = (event, newValue) => {
    setAmount(newValue);
  };

  const handleInputChange = (event) => {
    if (event.target.value == "") {
      setAmount("");
      return;
    }
    const value = clamp(event.target.value, 1, 100);
    setAmount(value);
  };

  const getImageIdByAmount = (value) => {
    return value < 33 ? "cypress" : value < 66 ? "araucaria" : "sequoia";
  };

  // call the campaign smart contract, send a donation
  const donate = () => {
    if (!account) {
      return onOpen();
    }
    if (!amount) return;
    const donationAmountWEI = ethers.utils.parseEther(amount.toString());

    if (library) {
      //const signer = library.getSigner();
      //console.log("signer", signer.address, "account", account);
      console.log(`${account} is about to donate`, donationAmountWEI/1e18, "ETH");
      //const transaction = await campaign.connect(signer)
      //        .donate({value: donationAmountWEI});
      //console.log("Transaction sent", transaction.hash);
      //await transaction.wait();
      requestDonateToWallet({value: donationAmountWEI});
      setWalletOpened(true);
    }
  }

  return (
    <Layout>
      <div
        style={{
          marginTop: "3rem",
          border: "1px solid #efefef",
          padding: "1rem 2rem",
          maxWidth: "700px",
        }}
      >
        <div style={{ margin: "1rem 2rem" }}>
          Display <strong>{getImageIdByAmount(amount)}.jpg</strong>
          <Slider
            value={amount}
            min={1}
            step={1}
            max={100}
            disabled={alreadyDonated}
            marks={[
              {
                value: 1,
                label: "Cypress",
              },
              {
                value: 33,
                label: "Araucaria",
              },
              {
                value: 66,
                label: "Sequoia",
              },
            ]}
            valueLabelDisplay="off"
            onChange={handleSliderChange}
          />
        </div>
        <div style={{ marginTop: "2rem" }}>
          You are donating{" "}
          <input
            style={{ border: "1px solid #efefef" }}
            type="number"
            value={amount}
            onChange={handleInputChange}
          />{" "}
          ETH
        </div>
        <Button mt="2" colorScheme="teal" 
          onClick={donate} 
          isLoading={walletOpened || donateTx.status=="Mining"}
          isDisabled={alreadyDonated}
        >
            {!account?
              "Connect Wallet":
              alreadyDonated?
                "Thanks for donating!":
                "Donate and mint your NFT"
            }
        </Button>
        <Box>
          // TODO: delete //
          Debug info= / 
          tokenId={tokenId??"..."} /
          balance={balance??"..."} / 
          donateTx.status={donateTx.status} /
        </Box>
      </div>
      <ConnectWalletModal onOpen={onOpen} isOpen={isOpen} onClose={onClose} ></ConnectWalletModal>
    </Layout>
  );
}

export default IndexPage;
