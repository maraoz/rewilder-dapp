import React, { useState, useEffect } from "react";

import { useEthers, useTransactions } from "@usedapp/core";
import Router from 'next/router'
import { useDisclosure } from "@chakra-ui/react";
import { ethers } from 'ethers';

import { Layout } from "./../components/Layout";
import { useBalanceOf, useTokenOfOwner } from "../lib/rewilderNFT";
import { useDonation, useCampaignFinalized } from "../lib/rewilderDonationCampaign";
import ThanksForDonating from "../components/ThanksForDonating";
import DonationControls from "../components/DonationControls";
import PendingDonation from "../components/PendingDonation";
import LoadingCampaign from "../components/LoadingCampaign";
import CampaignFinalized from "../components/CampaignFinalized";
import networkMatches from "../lib/networkMatches";
import ErrorModal from "../components/ErrorModal";
import useStoredState from "../lib/storedState";

import FLAVOR_TEXT from "../lib/flavorText";
import TIER_MARKERS from "../lib/tierMarkers";

function IndexPage() {
  const { account } = useEthers();
  const { transactions } = useTransactions();
  const { onOpen: openErrorModal, isOpen: isErrorModalOpen, onClose: closeErrorModal } = useDisclosure();
  const [donationFailedDismissed, setDonationFailedDismissed] = useStoredState(false, "donation.failed.dismissed");

  const [amount, setAmount] = useState(1);
  const { donateTx , donationEvents, requestDonationToWallet } = useDonation();
  const finalized = useCampaignFinalized();
  const incorrectNetwork = !networkMatches();
  
  const maybeNFTBalance = useBalanceOf(account);
  const nftBalance = maybeNFTBalance && maybeNFTBalance.toNumber();
  const maybeTokenId = useTokenOfOwner(account, nftBalance);
  const tokenId =  maybeTokenId && maybeTokenId.toNumber();
  const isLoading = account && !incorrectNetwork && (
    maybeNFTBalance === undefined || 
    (nftBalance && maybeTokenId === undefined) ||
    finalized === undefined
  );
  const alreadyDonated = donateTx.status=="Success" || tokenId > 0;
  const getTierForAmount = (amount) => {
    return amount < TIER_MARKERS['araucaria'] ?
      "cypress" :
      amount < TIER_MARKERS['sequoia'] ?
        "araucaria":
        "sequoia";
  };
  
  const tier = getTierForAmount(amount);
  const flavorText = FLAVOR_TEXT[tier]; 

  const donationPending = donateTx.status == 'Mining' ||
    (transactions.length > 0 && !transactions[0].receipt);
  
  const donationFailed = donateTx.status == 'Fail' ||
    (transactions.length > 0 && transactions[0].receipt && transactions[0].receipt.status == 0);
  
  const dismissFailedDonation = () => {
    setDonationFailedDismissed(true);
    closeErrorModal();
  };
  const errorModal = <ErrorModal onOpen={openErrorModal} isOpen={isErrorModalOpen} onClose={dismissFailedDonation} ></ErrorModal>;
    
  useEffect(() => {
    if (donationFailed && !donationFailedDismissed) {
      openErrorModal();
    }
  }, [donationFailed]);

  useEffect(() => {
    const redirectDelayMS = 5000;
    if (donationEvents) {
      const tokenId = donationEvents[0].args[2].toNumber();
      console.log(`tokenId=${tokenId} minted, redirecting in ${redirectDelayMS}ms...`);
      if (tokenId) {
        setTimeout(() => {
          Router.push(`/donation/${tokenId}`);
        }, redirectDelayMS);
      }
    }
  }, [donationEvents]);

  useEffect(() => {
    if ((alreadyDonated || donationPending) && transactions && transactions[0] && transactions[0].transaction) {
      setAmount(ethers.utils.formatEther(transactions[0].transaction.value));
    }
  }, [alreadyDonated, donationPending, transactions]);
  
  return (
    <>
    <Layout>
      <div className="container">
        <div className="hero-v1-wrapper">
          <div className="hero-v1-thumb">
            <img src={`assets/img/donation/${tier}-web.jpg`} className="banner-image" />
            <p>“{flavorText}”</p>
          </div>
          <div className="hero-v1-content">
            <img className="stamp" src={`/assets/img/shape/stamp-${tier}.svg`} alt={tier} />
            <div className="title">
              <img src="/assets/img/logo/hero-logo.svg" alt="logo" />
              <h2>Edition 001: Origin</h2>
            </div>
            {
              isLoading?
                <LoadingCampaign />:
                finalized?
                <CampaignFinalized tokenId={tokenId}/>:
                  alreadyDonated?
                    <ThanksForDonating tokenId={tokenId}/>:
                    donationPending?
                      <PendingDonation {...{donateTx: transactions.length>0?transactions[0]:donateTx}} />:
                      <DonationControls {...{amount, setAmount, tier, alreadyDonated, donateTx, requestDonationToWallet}}/>
            }
          </div>
        </div>
      </div>
    </Layout>
    {errorModal}
    </>
  );
}

export default IndexPage;
