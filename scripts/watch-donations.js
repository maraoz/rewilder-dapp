const {config, ethers, upgrades, network} = require("hardhat");

var admin = require('firebase-admin');
var serviceAccount = require("../rewilder-dev-firebase.json");
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(app);
const addresses = require("./addresses");

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
  });

  // listen for events
  console.log("Registering Donation event handler")
  
  campaign.on('Donation', async function(donor, amount, tokenID) {
    console.log(donor, "just donated", ethers.utils.formatEther(amount), 
      "ETH and obtained token id", tokenID);
    tier = 'cypress';
    // TODO: fix to proper comparison
    if (amount.gte(ethers.utils.parseEther("2.0"))) {
      tier = 'araucaria';
    }
    // TODO: fix to proper comparison
    if (amount.gte(ethers.utils.parseEther("3.0"))) {
      tier = 'sequoia';
    }
    const data = {
      name: 'Rewilder Origin Edition #'+tokenID,
      image: 'https://rewilder.xyz/assets/img/mockup/' + tier + '.png',
      attributes: [
        {trait_type: "donor", value: donor},
        {trait_type: "amount", value: ethers.utils.formatEther(amount)},
        {trait_type: "tier", value: tier},
      ]
    };
    console.log(data);
    const res = await db.collection(`tokens-${network.name}`).doc(tokenID.toString()).set(data);
    console.log("NFT metadata created and stored for", donor,"successfully!!");
  });
}

main();
