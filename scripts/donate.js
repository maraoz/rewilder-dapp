const {config, ethers, upgrades} = require("hardhat");
const fs = require("fs");
const path = require('path');


const contractAddressFile = `${config.paths.artifacts}${path.sep}..${path.sep}addresses.json`
const addresses = JSON.parse(fs.readFileSync(contractAddressFile));
console.log(addresses);

async function main() {
  
  const [deployer, wallet, donorA] = await ethers.getSigners();

  console.log("Donating with the account:", donorA.address);
  console.log("Account balance:", 
    (await donorA.getBalance()/1e18).toString(), 
    network.name, "ETH");

  // get donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await RewilderDonationCampaign.attach(addresses.RewilderDonationCampaign);
  console.log("RewilderDonationCampaign attached to:", campaign.address);

  // send 1 ETH donation
  const donationAmountWEI = ethers.utils.parseEther("1.0");
  console.log("Donating", donationAmountWEI.toString(), "wei");
  const tx = await campaign.connect(donorA).donate({
    value: donationAmountWEI})
  console.log(tx);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
