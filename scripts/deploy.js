const {config, ethers, upgrades, network} = require("hardhat");
const fs = require("fs");
const path = require('path')

const contractAddressFile = `${config.paths.artifacts}${path.sep}..${path.sep}addresses-${network.name}.json`

async function verifyImplementationOnEtherscan(implAddress) {
  if (network.name == "localhost" || network.name == "hardhat") 
    return;

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
  
  let [deployer, wallet] = await ethers.getSigners();
  wallet = wallet.address;
  if (process.env.REWILDER_MULTISIG && 
    ethers.utils.isAddress(process.env.REWILDER_MULTISIG)) {
    
    wallet = process.env.REWILDER_MULTISIG
  }
  console.log("Using wallet address:", wallet);
  const addresses = {};
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", 
    (await deployer.getBalance()/1e18).toString(), 
    network.name, "ETH");
  
  addresses['network'] = network.name;
    
  if (network.name == "localhost") {
    // multicall (required by usedapp)
    const MulticallContract = await hre.ethers.getContractFactory("Multicall");
    const multicall = await MulticallContract.deploy();
    await multicall.deployed();
    addresses["Multicall"] = multicall.address;
    console.log("Multicall deployed to:", multicall.address);
  }
  
  // NFT
  console.log("Deploying upgradeable RewilderNFT...");
  const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
  const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  await nft.deployed();
  console.log("RewilderNFT proxy deployed to:", nft.address);
  const nftImpl = await upgrades.erc1967.getImplementationAddress(nft.address);
  console.log("RewilderNFT implementation at:", nftImpl);
  addresses["RewilderNFT"] = nft.address;
  addresses["RewilderNFTImpl"] = nftImpl;
  await verifyImplementationOnEtherscan(nftImpl);
  
  
  // donation campaign
  console.log("Deploying upgradeable RewilderDonationCampaign...");
  const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
  const campaign = await RewilderDonationCampaign.deploy(
    nft.address, wallet
  );
  await campaign.deployed();
  console.log("RewilderDonationCampaign deployed to:", campaign.address);
  addresses["RewilderDonationCampaign"] = campaign.address;

  // transfer nft ownership to donation campaign
  console.log("Transferring NFT ownership to Campaign...");
  await nft.transferOwnership(campaign.address);
  
  
  // re-create contract address file if needed, and back up old one
  if (fs.existsSync(contractAddressFile)) {
    const ts = new Date().getTime();
    const contractAddressFileNoJSON = contractAddressFile.split(".")[0];
    fs.copyFileSync(contractAddressFile, `${contractAddressFileNoJSON}-${ts}.json`)
    fs.unlinkSync(contractAddressFile);
  }
  
  // Save the new contract addresses so our frontend can read it
  console.log("Saving deployed contract addresses to file...");
  fs.appendFileSync(contractAddressFile, JSON.stringify(addresses, null, 2));
  console.log("Done!");
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
