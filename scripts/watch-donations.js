const {config, ethers, upgrades, network} = require("hardhat");


var mineOneBlock = async function() {
  console.log("Requesting node to mine one block");
  await network.provider.send("evm_mine");
}

var admin = require('firebase-admin');
var serviceAccount = require("../rewilder-dev-firebase.json");
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(app);
const addresses = require("./addresses");
const indexDonation = require("./lib/index-donation");

async function main() {
  const [deployer, wallet, donorA] = await ethers.getSigners();

  // get donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");

  const campaign = RewilderDonationCampaign
      .attach(addresses.RewilderDonationCampaign);
  console.log("RewilderDonationCampaign attached to:", campaign.address);
  
  // block tick
  ethers.provider.on("block", (blockNumber) => {
    console.log("block", blockNumber, "mined at", new Date().getTime());
  });
  // Emitted when any new pending transaction is noticed
  ethers.provider.on("pending", (tx) => {
    console.log("pending tx", tx.hash);
    if (!config.networks.hardhat.mining.auto &&
      network.name == 'localhost') {
      setTimeout(mineOneBlock, 5000);
    }
  });

  // listen for events
  console.log("Registering Donation event handler")
  
  campaign.on('Donation', async function(donor, amount, tokenID) {
    await indexDonation(donor, amount, tokenID);
  });
}

main();
