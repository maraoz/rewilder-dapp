const { ethers } = require("hardhat");
const addresses = require("./lib/addresses");

async function main() {
  
  let [deployer, wallet] = await ethers.getSigners();

  console.log("Finalizing with the account:", wallet.address);
  console.log(process.env.REWILDER_MULTISIG)
  if (process.env.REWILDER_MULTISIG && 
    ethers.utils.isAddress(process.env.REWILDER_MULTISIG)) {
    wallet = process.env.REWILDER_MULTISIG;
  }

  console.log("Finalizing with the account:", wallet.address);
  console.log("Account balance:", 
    (await wallet.getBalance()/1e18).toString(), 
    network.name, "ETH");

  // get donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = RewilderDonationCampaign.attach(addresses.RewilderDonationCampaign);
  console.log("RewilderDonationCampaign attached to:", campaign.address);

  // finalize campaign
  console.log("Finalizing...");
  const tx = await campaign.connect(wallet).finalize({gasPrice: 1000*1e9})
  console.log(tx.hash);
  await tx.wait();
  console.log("done!");
}

main()
  .then(() => setInterval(function() { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
