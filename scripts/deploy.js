const {config, ethers, upgrades, erc1967} = require("hardhat");
const fs = require("fs");
const path = require('path')

const contractAddressFile = `${config.paths.artifacts}${path.sep}contracts${path.sep}contractAddress.js`

async function verifyImplementation(implAddress) {
  try {
    await hre.run("verify:verify", {
      address: implAddress,
      constructorArguments: [],
    });
  } catch(err) {
    if (err.message.includes("Contract source code already verified")) {
      console.log(err.message)
    } else {
      throw err;
    }
  }
}

async function main() {
  
  // TODO: allow configuring wallet externally
  const [deployer, wallet] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", 
    (await deployer.getBalance()/1e18).toString(), 
    network.name, "ETH");
    
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
  if (network.name == "localhost") {
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
    await greeter.deployed();
    saveFrontendFiles(greeter, "Greeter");
    console.log("Greeter deployed to:", greeter.address);
  }
  
  // NFT
  console.log("Deploying upgradeable RewilderNFT...");
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  await nft.deployed();
  saveFrontendFiles(nft, "RewilderNFT");
  console.log("RewilderNFT proxy deployed to:", nft.address);
  const nftImpl = await upgrades.erc1967.getImplementationAddress(nft.address);
  console.log("RewilderNFT implementation at:", nftImpl);
  await verifyImplementation(nftImpl);
  
  
  // donation campaign
  console.log("Deploying upgradeable RewilderDonationCampaign...");
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await upgrades.deployProxy(RewilderDonationCampaign, 
    [nft.address, wallet.address], { kind: "uups" });
  await campaign.deployed();
  saveFrontendFiles(campaign, "RewilderDonationCampaign");
  console.log("RewilderDonationCampaign proxy deployed to:", campaign.address);
  const campaignImpl = await upgrades.erc1967.getImplementationAddress(campaign.address);
  console.log("RewilderDonationCampaign implementation at:", campaignImpl);
  await verifyImplementation(campaignImpl);
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
