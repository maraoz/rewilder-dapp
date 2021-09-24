const { ethers } = require("hardhat");
const gnosisAddresses = require("./gnosis-addresses");
const { expect } = require("chai");
const { AddressZero } = require("@ethersproject/constants");
const { executeContractCallWithSigners } = require("./gnosis-utils");

// - make sure you have gnosis safe-contracts deployed into your localhost node
// yarn install && npx yarn hardhat --network localhost deploy
// - complete gnosis-addresses.js with deployed at addresses of GnosisSafeProxyFactory and GnosisSafe
// - if gnosis contracts are already deployed, then start the localhost node
// npx hardhat node
// - run test
// npx hardhat run ./scripts/gnosis-multisig-test.js --network localhost

async function main() {
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
  const eventsLog = iface.parseLog(txReceipt.events[1])
  const { proxy, singleton } = eventsLog.args;

  console.log("Deployed proxy at: ", proxy);
  console.log("Master contract at: ", singleton);

  const safe = GnosisSafeFactory.attach(proxy);

  // Create and deploy RewilderCampaign
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await RewilderDonationCampaign.deploy(nft.address, safe.address);
  await campaign.deployed();

  // transfer nft ownership to donation campaign
  await nft.transferOwnership(campaign.address);

  // it sets the right owner
  expect(await campaign.owner()).to.equal(safe.address)

  //it "has nft ownership"
  expect(await nft.owner()).to.equal(campaign.address);

  let preBalance = await ethers.provider.getBalance(safe.address);
  await logBalance(safe.address);

  // it accepts multiple donations from different donors
  const donationAmountWEI = ethers.utils.parseEther("1.0");

  console.log("Donating %d ETH ", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorA).receiveDonation({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(safe.address)).to.equal(preBalance.add(donationAmountWEI));

  console.log("Donating %d ETH ", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorB).receiveDonation({ value: donationAmountWEI });
  expect(await ethers.provider.getBalance(safe.address)).to.equal(preBalance.add(ethers.utils.parseEther("2.0")));
  await logBalance(safe.address);

  // gnosis safe can pause campaign
  console.log("Pausing campaign");
  await executeContractCallWithSigners(safe, campaign, "pause", [], [signer1, signer2], false, {});
  expect(await campaign.paused()).to.equal(true);

  // // when paused, donations revert
  await expect(campaign.connect(donorA).receiveDonation({
    value: donationAmountWEI
  })).to.be.revertedWith('Pausable: paused')

  // only gnosis safe can unpause campaign
  await expect(campaign.connect(donorA).unpause()).to.be.revertedWith('Ownable: caller is not the owner');
  console.log("Unpausing campaign");
  await executeContractCallWithSigners(safe, campaign, "unpause", [], [signer2, signer3], false, {});
  expect(await campaign.paused()).to.equal(false);

  // when unpaused, donation works again and mints NFTs
  console.log("Donating %d ETH ", ethers.utils.formatEther(donationAmountWEI));
  await campaign.connect(donorC).receiveDonation({ value: donationAmountWEI });
  expect(await nft.ownerOf(3)).to.be.equal(donorC.address);
  await logBalance(safe.address);

  // gnosis safe can finalize campaign
  console.log("Finalizing campaign");
  await executeContractCallWithSigners(safe, campaign, "finalize", [], [signer1, signer2], false, {});
  expect(await campaign.paused()).to.equal(true);

  // gnosis safe gets ownership of the token
  expect(await nft.owner()).to.equal(safe.address);
}

main()
  .then(() => setInterval(function () { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function logBalance(address) {
  preBalance = await ethers.provider.getBalance(address);
  console.log("Account balance after donations", ethers.utils.formatEther(preBalance));
}

