import React, { useState, useEffect } from "react";
import Router from 'next/router'
//import { Button, Box, useDisclosure} from "@chakra-ui/react";
import { useEthers, useContractFunction, useEtherBalance } from "@usedapp/core";
import Layout from "./../components/Layout";
import { addressFor } from "../lib/addresses";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import { ethers } from 'ethers';
import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";

function DesignPage() {
  const { account, error, library } = useEthers();
  const etherBalance  = useEtherBalance(account);
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
    
  const maybeNFTBalance = useBalanceOf(account);
  const nftBalance = maybeNFTBalance && maybeNFTBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, nftBalance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  
  const alreadyDonated = donateTx.status=="Success" || nftBalance > 0;
  const insufficientBalance = amount > etherBalance/1e18;
    
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
    if (nftBalance > 0 && tokenId) {
      console.log(`balance=${nftBalance}, tokenId=${tokenId}. redirecting in ${redirectDelayMS}ms...`);
      // TODO: do something here instead of redirecting
      setTimeout(() => {
        //Router.push(`/nft/${tokenId}`);
      }, redirectDelayMS);
    }
  }, [nftBalance, tokenId]);
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
      Design!
    </Layout>
  );
}

export default DesignPage;
