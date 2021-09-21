const { ethers } = require("hardhat");
const gnosisAddresses = require("./gnosis-addresses");

async function main() {

  const ZERO_ADDRESS = ethers.constants.AddressZero;
  const [signer0, signer1, signer2, signer3] = await ethers.getSigners();
  const safeOwners = [signer1, signer2, signer3].map(signer => signer.address);
  const DEFAULT_FALLBACK_HANDLER_ADDRESS = ZERO_ADDRESS;
  const numConfirmations = 2;

  console.log("Creating safe for signers :", safeOwners);

  // Get deployed GnosisSafe Master Copy
  const GnosisSafeFactory = await ethers.getContractFactory("GnosisSafe");
  const gnosisSafeContract = GnosisSafeFactory.attach(gnosisAddresses.GnosisSafe.deployedAt);

  // prepare setup params
  const params = [
    safeOwners,
    numConfirmations,
    ZERO_ADDRESS,
    "0x",
    DEFAULT_FALLBACK_HANDLER_ADDRESS,
    ZERO_ADDRESS,
    0,
    ZERO_ADDRESS
  ];
  const setupParams = gnosisSafeContract.interface.encodeFunctionData("setup", params);

  // Get deployed GnosisSafeProxyFactory
  const ProxyFactory = await ethers.getContractFactory("GnosisSafeProxyFactory");
  const ProxyFactoryContract = ProxyFactory.attach(gnosisAddresses.GnosisSafeProxyFactory.deployedAt);

  // Create 2of3 GnosisSafe
  const txResponse = await ProxyFactoryContract.createProxy(gnosisSafeContract.address, setupParams);
  const txReceipt = await txResponse.wait();

  let abi = ["event ProxyCreation(address proxy, address singleton)"];
  let iface = new ethers.utils.Interface(abi);
  let eventsLog = iface.parseLog(txReceipt.events[1]);
  const { proxy, singleton } = eventsLog.args;

  console.log("Deployed proxy at: ", proxy);
  console.log("Master contract at: ", singleton);


}

main()
  .then(() => setInterval(function () { process.exit(0) }, 1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
