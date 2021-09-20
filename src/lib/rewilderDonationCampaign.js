import { ethers } from 'ethers';
import { useContractFunction } from "@usedapp/core";

import { addressFor } from "../lib/addresses";

import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";
const RewilderDonationCampaignInterface = new ethers.utils.Interface(RewilderDonationCampaign.abi)
const campaignAddress = addressFor("RewilderDonationCampaign");
const campaign = new ethers.Contract(
campaignAddress,
  RewilderDonationCampaignInterface,
);

export function useDonation() {
  const { state: donateTx , events: donationEvents, send: requestDonationToWallet } =
    useContractFunction(campaign, "donate", { transactionName: 'Donate' });

  return { donateTx , donationEvents, requestDonationToWallet };
}