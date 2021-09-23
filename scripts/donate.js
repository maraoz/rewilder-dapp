const {config, ethers, upgrades} = require("hardhat");
const addresses = require("./addresses");

async function main() {
  
  const [deployer, wallet, donorA] = await ethers.getSigners();

  console.log("Donating with the account:", donorA.address);
  console.log("Account balance:", 
    (await donorA.getBalance()/1e18).toString(), 
    network.name, "ETH");

  // get donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = RewilderDonationCampaign.attach(addresses.RewilderDonationCampaign);
  console.log("RewilderDonationCampaign attached to:", campaign.address);

  // send 1 ETH donation
  const donationAmountWEI = ethers.utils.parseEther("1.0");
  console.log("Donating", donationAmountWEI.toString(), "wei");
  const tx = await campaign.connect(donorA).receiveDonation({
    value: donationAmountWEI})
  console.log(tx.hash);
  await tx.wait();
}

main()
  .then(() => setInterval(function() { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
