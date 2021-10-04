const {config, ethers, upgrades} = require("hardhat");
const addresses = require("./lib/addresses");
const { expect } = require("chai");

const db = require('./lib/firestore');

async function main() {

  wallet = process.env.REWILDER_MULTISIG;

  // get contracts
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = RewilderDonationCampaign.attach(addresses.RewilderDonationCampaign);
  console.log("RewilderDonationCampaign attached to:", campaign.address);
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = RewilderDonationCampaign.attach(addresses.RewilderNFT);
  console.log("RewilderNFT attached to:", nft.address);
  console.log("Using wallet address:", wallet);
  console.log("=================");

  // check owners
  process.stdout.write("Checking if nft owner is campaign... ");
  expect(await nft.owner()).to.equal(campaign.address);
  console.log("✔️");
  process.stdout.write("Checking if campaign owner is wallet... ");
  expect(await campaign.owner()).to.equal(wallet);
  console.log("✔️");

  // check if firebase env is properly set
  const collection = db.collection(`tokens-${network.name}`);
  // for scripts
  process.stdout.write("Attempting to write in db... ");
  await collection.doc('setup').set({'done': true});
  console.log("✔️");

  process.stdout.write("Checking if write in db was successful... ");
  const response = (await collection.doc('setup').get()).data();
  expect(response.done).to.equal(true);
  console.log("✔️");
  // for server
  // TODO:


  // done!
  console.log("Done! ✨")

}

main()
  .then(() => setInterval(function() { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
