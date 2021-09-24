import { ethers } from 'ethers';
import { useContractFunction, useContractCall } from "@usedapp/core";

import { addressFor } from "../lib/addresses";

import RewilderDonationCampaign from "./../artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json";
const RewilderDonationCampaignInterface = new ethers.utils.Interface(RewilderDonationCampaign.abi)
const campaignAddress = addressFor("RewilderDonationCampaign");
const campaign = new ethers.Contract(
  campaignAddress,
  RewilderDonationCampaignInterface,
);

export function useCampaignFinalized() {
  const [finalized] = useContractCall(
    {
      abi: RewilderDonationCampaignInterface,
      address: campaignAddress,
      method: "paused",
      args: [],
    }
  ) ?? [];
  return finalized;
}

export function useDonation() {
  const { state: donateTx , events: donationEvents, send: requestDonationToWallet } =
    useContractFunction(campaign, "receiveDonation", { transactionName: 'Donation' });

  return { donateTx , donationEvents, requestDonationToWallet };
}