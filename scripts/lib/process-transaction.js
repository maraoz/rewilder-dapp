const indexDonation = require("./index-donation");
const addresses = require("./addresses");
const RewilderDonationCampaignABI = require('../../src/artifacts/contracts/RewilderDonationCampaign.sol/RewilderDonationCampaign.json').abi;

let iface = new ethers.utils.Interface(RewilderDonationCampaignABI);

const processTransaction = async (tx) => {
  const txid = tx.hash;
  const receipt = await ethers.provider.getTransactionReceipt(txid);
  for (let i = 0; i < receipt.logs.length; i++) {
    let log = receipt.logs[i];
    if (log.address != addresses.RewilderDonationCampaign) {
      continue;
    }
    let event = iface.parseLog(log);
    if (event.name != 'DonationReceived') {
      console.error('unrecognized event:', event.name);
      continue;
    }
    const {donor, amount, tokenID} = event.args;
    await indexDonation(donor, amount, tokenID, txid, tx.timestamp*1000);
    break;
  }
}
module.exports = processTransaction;