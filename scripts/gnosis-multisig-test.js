const { ethers } = require("hardhat");
const { expect } = require("chai");
const { AddressZero } = require("@ethersproject/constants");

const { executeContractCallWithSigners, createSafeFor } = require("./lib/gnosis-utils");

// - make sure you have gnosis safe-contracts deployed into your localhost node
// yarn install && npx yarn hardhat --network localhost deploy
// - complete gnosis-addresses.js with deployed at addresses of GnosisSafeProxyFactory and GnosisSafe
// - if gnosis contracts are already deployed, then start the localhost node
// npx hardhat node
// - run test
// npx hardhat run ./scripts/gnosis-multisig-test.js --network localhost

async function main() {
  const [signer1, signer2, signer3, donorA, donorB, donorC, signer4, signer5, signer6] = await ethers.getSigners();

  const campaignSafe = await createSafeFor([signer1, signer2, signer3], 2);

  // create and deploy RewilderCampaign
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await RewilderDonationCampaign.deploy(nft.address, campaignSafe.address);
  await campaign.deployed();
  console.log("RewilderDonationCampaign deployed at: ", campaign.address);
  
  // transfer nft ownership to donation campaign
  await nft.transferOwnership(campaign.address);

  // it sets the right owner
  expect(await campaign.owner()).to.equal(campaignSafe.address)

  //  it "has nft ownership"
  expect(await nft.owner()).to.equal(campaign.address);

  // it accepts multiple donations from different donors
  let preBalance = await ethers.provider.getBalance(campaignSafe.address);
  await logBalance(campaignSafe.address);

  const donationAmountWEI = ethers.utils.parseEther("1.0");

  expect(await nft.balanceOf(donorA.address)).to.equal(0);
  console.log("Donor A donating %d ETH...", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorA).receiveDonation({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(campaignSafe.address)).to.equal(preBalance.add(donationAmountWEI));
  expect(await nft.balanceOf(donorA.address)).to.equal(1);

  expect(await nft.balanceOf(donorB.address)).to.equal(0);
  console.log("Donor B donating %d ETH...", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorB).receiveDonation({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(campaignSafe.address)).to.equal(preBalance.add(ethers.utils.parseEther("2.0")));
  await logBalance(campaignSafe.address);
  expect(await nft.balanceOf(donorB.address)).to.equal(1);

  // it accepts donations from a gnosis safe account
  const donorSafe = await createSafeFor([signer4, signer5, signer6], 2);
  await logBalance(donorSafe.address);
  await signer1.sendTransaction({to: donorSafe.address, value: ethers.utils.parseEther("150.0")});
  await logBalance(donorSafe.address);

  console.log("Donor Safe donating %d ETH...", ethers.utils.formatEther(donationAmountWEI));
  await executeContractCallWithSigners(donorSafe, campaign, "receiveDonation", [], [signer4, signer5], false, {gasPrice: "1", value: donationAmountWEI});
  expect(await nft.ownerOf(3)).to.be.equal(donorSafe.address);
  expect(await nft.balanceOf(donorSafe.address)).to.equal(1);
  await logBalance(campaignSafe.address);

  // gnosis safe can pause campaign
  console.log("Pausing campaign...");
  await executeContractCallWithSigners(campaignSafe, campaign, "pause", [], [signer1, signer2], false, {});
  expect(await campaign.paused()).to.equal(true);

  // when paused, donations revert
  console.log("Attempting to donate now, should revert...")
  await expect(campaign.connect(donorA).receiveDonation({
    value: donationAmountWEI
  })).to.be.revertedWith('Pausable: paused')

  // only gnosis safe can unpause campaign
  await expect(campaign.connect(donorA).unpause()).to.be.revertedWith('Ownable: caller is not the owner');
  console.log("Unpausing campaign...");
  await executeContractCallWithSigners(campaignSafe, campaign, "unpause", [], [signer2, signer3], false, {});
  expect(await campaign.paused()).to.equal(false);
  expect(await nft.balanceOf(donorC.address)).to.equal(0);

  // when unpaused, donation works again and mints NFTs
  console.log("Donor C donating %d ETH...", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorC).receiveDonation({ value: donationAmountWEI });
  expect(await nft.ownerOf(4)).to.be.equal(donorC.address);
  expect(await nft.balanceOf(donorC.address)).to.equal(1);
  await logBalance(campaignSafe.address);

  // gnosis safe can finalize campaign
  console.log("Finalizing campaign...");
  await executeContractCallWithSigners(campaignSafe, campaign, "finalize", [], [signer1, signer2], false, {});
  expect(await campaign.paused()).to.equal(true);

  // gnosis safe gets ownership of the token
  expect(await nft.owner()).to.equal(campaignSafe.address);
  console.log("gnosis safe is now owner of NFT contract");

  // further donations should fail
  console.log("Further donations should fail...")
  await expect(campaign.connect(donorA).receiveDonation({
    value: donationAmountWEI
  })).to.be.revertedWith('Pausable: paused')
  console.log("Done!");
}

main()
  .then(() => setInterval(function () { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function logBalance(address) {
  preBalance = await ethers.provider.getBalance(address);
  console.log("Balance for %s:", address, ethers.utils.formatEther(preBalance));
}
