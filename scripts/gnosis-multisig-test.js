const { ethers } = require("hardhat");
const gnosisAddresses = require("./gnosis-addresses");
const { expect } = require("chai");
const { AddressZero } = require("@ethersproject/constants");
const { executeContractCallWithSigners } = require("./gnosis-utils");

async function main() {
  // make sure you have gnosis safe-contracts deployed into your localhost node
  // yarn install && npx yarn hardhat --network localhost deploy

  // npx hardhat run ./scripts/gnosis-multisig-test.js --network localhost
  const [signer1, signer2, signer3, donorA, donorB, donorC] = await ethers.getSigners();
  const safeOwners = [signer1, signer2, signer3].map(signer => signer.address);
  const DEFAULT_FALLBACK_HANDLER_ADDRESS = AddressZero;
  const numConfirmations = 2;

  console.log("Creating safe for signers :", safeOwners);

  // Get deployed GnosisSafe Master Copy
  const GnosisSafeFactory = await ethers.getContractFactory("GnosisSafe");
  const gnosisSafeContract = GnosisSafeFactory.attach(gnosisAddresses.GnosisSafe.deployedAt);

  // prepare setup params
  const params = [
    safeOwners,
    numConfirmations,
    AddressZero,
    "0x",
    DEFAULT_FALLBACK_HANDLER_ADDRESS,
    AddressZero,
    0,
    AddressZero
  ];
  const setupParams = gnosisSafeContract.interface.encodeFunctionData("setup", params);

  // Get deployed GnosisSafeProxyFactory
  const ProxyFactory = await ethers.getContractFactory("GnosisSafeProxyFactory");
  const ProxyFactoryContract = ProxyFactory.attach(gnosisAddresses.GnosisSafeProxyFactory.deployedAt);

  // Create 2of3 GnosisSafe
  const txResponse = await ProxyFactoryContract.createProxy(gnosisSafeContract.address, setupParams);
  const txReceipt = await txResponse.wait();

  const abi = ["event ProxyCreation(address proxy, address singleton)"];
  const iface = new ethers.utils.Interface(abi);
  const eventsLog = iface.parseLog(txReceipt.events[1]);
  const { proxy, singleton } = eventsLog.args;

  console.log("Deployed proxy at: ", proxy);
  console.log("Master contract at: ", singleton);
  
  const safe = GnosisSafeFactory.attach(proxy);

  // Create and deploy RewilderCampaign
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await RewilderDonationCampaign.deploy(nft.address, proxy);
  await campaign.deployed();

  // transfer nft ownership to donation campaign
  await nft.transferOwnership(campaign.address);

  // it sets the right owner
  expect(await campaign.owner()).to.equal(proxy)

  //it "has nft ownership"
  expect(await nft.owner()).to.equal(campaign.address);

  let preBalance = await ethers.provider.getBalance(proxy);
  console.log("Safe account balance before donations ", ethers.utils.formatEther(preBalance));

  // it accepts multiple donations from different donors
  const donationAmountWEI = ethers.utils.parseEther("1.0");

  await campaign.connect(donorA).donate({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(proxy)).to.equal(preBalance.add(donationAmountWEI));

  await campaign.connect(donorB).donate({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(proxy)).to.equal(preBalance.add(ethers.utils.parseEther("2.0")));

  preBalance = await ethers.provider.getBalance(proxy);
  console.log("Safe account balance after donations", ethers.utils.formatEther(preBalance));

  // gnosis safe can pause campaign
  await executeContractCallWithSigners(safe, campaign, "finalize", [], [signer1, signer2], false, {});
  expect(await campaign.paused()).to.equal(true);

  // // when paused, donations revert
  await expect(campaign.connect(donorA).donate({
    value: donationAmountWEI
  })).to.be.revertedWith('Pausable: paused')

  // // only gnosis safe can unpause campaign
  await expect(campaign.connect(donorA).unpause()).to.be.revertedWith('Ownable: caller is not the owner');
  await executeContractCallWithSigners(safe, campaign, "unpause", [], [signer2, signer3], false, {});
  expect(await campaign.paused()).to.equal(false);

  // // when unpaused, donation works again and mints NFTs
  // await campaign.connect(donorC).donate({ value: donationAmountWEI });
  // expect(await nft.ownerOf(1)).to.be.equal(donorC.address);
}

main()
  .then(() => setInterval(function () { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
