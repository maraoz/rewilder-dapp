const { ethers } = require("hardhat");
const gnosisAddresses = require("./gnosis-addresses");
const { expect } = require("chai");

async function main() {
  // make sure you have gnosis safe-contracts deployed into your localhost node
  // yarn install && npx yarn hardhat --network localhost deploy

  // npx hardhat run ./scripts/gnosis-multisig-test.js --network localhost
  const ZERO_ADDRESS = ethers.constants.AddressZero;
  const [signer1, signer2, signer3, donorA, donorB,] = await ethers.getSigners();
  const safeOwners = [signer1, signer2, signer3].map(signer => signer.address);
  const DEFAULT_FALLBACK_HANDLER_ADDRESS = ZERO_ADDRESS;
  const numConfirmations = 2;

  console.log("Creating safe for signers :", safeOwners);

  // Get deployed GnosisSafe Master Copy
  const GnosisSafeFactory = await ethers.getContractFactory("GnosisSafe");
  const gnosisSafeContract = GnosisSafeFactory.attach(gnosisAddresses.GnosisSafe.deployedAt);

  // prepare setup params
  const params = [
    safeOwners,
    numConfirmations,
    ZERO_ADDRESS,
    "0x",
    DEFAULT_FALLBACK_HANDLER_ADDRESS,
    ZERO_ADDRESS,
    0,
    ZERO_ADDRESS
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
  console.log("multisig account balance ", preBalance);
    
  // it accepts multiple donations from different donors
  const donationAmountWEI = ethers.utils.parseEther("1.0");
  await expect(
    await campaign.connect(donorA).donate({value: donationAmountWEI})
  ).to.changeEtherBalance(proxy, donationAmountWEI);
  
  // // donor B
  // await expect(await campaign.connect(donorB).donate({
  //   value: donationAmountWEI}))
  //   .to.changeEtherBalance(wallet, donationAmountWEI);
  // // wallet should have 2 ETH more now
  // expect(preBalance.add(ethers.utils.parseEther("2.0")))
  //   .to.equal(await ethers.provider.getBalance(proxy));

}

main()
  .then(() => setInterval(function () { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
