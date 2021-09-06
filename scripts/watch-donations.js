const {config, ethers, upgrades, network} = require("hardhat");
const {Firestore} = require('@google-cloud/firestore');

const firestore = new Firestore();
const addresses = require("./addresses");

async function main() {
  const [deployer, wallet, donorA] = await ethers.getSigners();

  var wsProvider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/cea7dccbc1994ce1a585d6f06eda519b");
  console.log(await wsProvider.getBalance(deployer.address).toString());
  
  // get donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");

  const campaign = RewilderDonationCampaign
      .attach(addresses.RewilderDonationCampaign);
      //.connect(wsProvider)
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
  
  campaign.on('Donation', console.log);
  let filter = campaign.filters.Donation(null,null);
  campaign.on(filter, (a, b, c) => {
      console.log(a, b, c);
  });
}

main();
