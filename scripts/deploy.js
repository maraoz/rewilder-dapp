const {config, ethers, upgrades} = require("hardhat");
const fs = require("fs");
const path = require('path')

const contractAddressFile = `${config.paths.artifacts}${path.sep}contracts${path.sep}contractAddress.js`

async function main() {
  
  const [deployer, wallet] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()/1e18).toString());

  // re-create contract address file if needed, and back up old one
  if (fs.existsSync(contractAddressFile)) {
    const ts = new Date().getTime();
    const contractAddressFileNoJS = contractAddressFile.split(".")[0];
    fs.copyFileSync(contractAddressFile, `${contractAddressFileNoJS}-${ts}.js`)
    fs.unlinkSync(contractAddressFile);
  }

  fs.appendFileSync(
    contractAddressFile,
    `export const networkName = '${network.name}'\n`
  );

  // greeter
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  saveFrontendFiles(greeter, "Greeter");
  console.log("Greeter deployed to:", greeter.address);

  // NFT
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await RewilderNFT.deploy();
  const rewilderNFT = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  await nft.deployed();
  saveFrontendFiles(nft, "RewilderNFT");
  console.log("RewilderNFT deployed to:", nft.address);

  // donation campaign
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await upgrades.deployProxy(RewilderDonationCampaign, 
    [nft.address, wallet.address], { kind: "uups" });
  await campaign.deployed();
  saveFrontendFiles(campaign, "RewilderDonationCampaign");
  console.log("RewilderDonationCampaign deployed to:", campaign.address);
}

// Save the contract address so our frontend can read it
// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(contract, contractName) {
  fs.appendFileSync(
    contractAddressFile,
    `export const ${contractName} = '${contract.address}'\n`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
