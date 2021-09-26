const {ethers, network} = require("hardhat");

const indexDonation = require("./lib/index-donation");
const addresses = require("./lib/addresses");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let donationCampaignAddress = addresses.RewilderDonationCampaign;
  let provider = new ethers.providers.EtherscanProvider(network.name);
  let history = await provider.getHistory(donationCampaignAddress);
  console.log('Found ', history.length, 'donation transactions.');
  for(var tx of history){
    if (tx.to == donationCampaignAddress){
      let txid = tx.hash;
      const receipt = await ethers.provider.getTransactionReceipt(txid);
      let abi = [ "event DonationReceived(address indexed donor, uint256 value, uint256 indexed tokenID)" ];
      let iface = new ethers.utils.Interface(abi);
      let log = iface.parseLog(receipt.logs[1]);
      const {donor, value: amount, tokenID} = log.args;
      await indexDonation(donor, amount, tokenID, txid);
      await sleep(1000);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
