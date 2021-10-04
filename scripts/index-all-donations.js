const {ethers, network} = require("hardhat");

const processTransaction = require("./lib/process-transaction");
const addresses = require("./lib/addresses");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!process.env.ETHERSCAN_KEY) {
    console.log('Required ETHERSCAN_KEY env variable not set.');
    return;
  }
  let donationCampaignAddress = addresses.RewilderDonationCampaign;
  console.log('Using donation address', donationCampaignAddress);
  let etherscan = new ethers.providers.EtherscanProvider(network.name, process.env.ETHERSCAN_KEY);
  let history = await etherscan.getHistory(donationCampaignAddress);
  
  console.log('Found', history.length, 'transactions.');
  for(var tx of history){
    if (tx.to == donationCampaignAddress){
      console.log("indexing", tx.hash);
      await processTransaction(tx);
      console.log("indexed", tx.hash, '- now waiting...')
      await sleep(5000);
    } else {
      console.log('skipping', tx.hash);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
