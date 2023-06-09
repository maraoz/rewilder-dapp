const { ethers } = require("hardhat");
const { AddressZero } = require("@ethersproject/constants");

let _deployedContracts = undefined;

const EIP712_SAFE_TX_TYPE = {
  // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
  SafeTx: [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ]
}

async function safeSignTypedData(signer, safe, safeTx) {
  const cid = await chainId();
  const signerAddress = await signer.getAddress();
  const signature = await signer._signTypedData({ verifyingContract: safe.address, chainId: cid }, EIP712_SAFE_TX_TYPE, safeTx);

  const signedData = {
    signer: signerAddress,
    data: signature
  };
  return signedData;
}

function buildSignatureBytes(signatures) {
  signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()));
  let signatureBytes = "0x"
  for (const sig of signatures) {
    signatureBytes += sig.data.slice(2)
  }
  return signatureBytes;
}

async function executeTx(safe, safeTx, signatures) {
  const signatureBytes = buildSignatureBytes(signatures);
  return safe.execTransaction(safeTx.to, safeTx.value, safeTx.data, safeTx.operation, safeTx.safeTxGas, safeTx.baseGas, safeTx.gasPrice, safeTx.gasToken, safeTx.refundReceiver, signatureBytes, {});
}

function buildContractCall(contract, method, params, nonce, delegateCall, overrides) {
  const data = contract.interface.encodeFunctionData(method, params);
  const safeTxParams = Object.assign({
    to: contract.address,
    data,
    operation: delegateCall ? 1 : 0,
    nonce
  }, overrides);

  return buildSafeTransaction(safeTxParams)
}

async function executeTxWithSigners(safe, tx, signers) {
  const sigs = await Promise.all(signers.map((signer) => safeSignTypedData(signer, safe, tx)));
  return executeTx(safe, tx, sigs);
}

async function executeContractCallWithSigners(safe, contract, method, params, signers, delegateCall, overrides) {
  const nonce = await safe.nonce();
  const tx = buildContractCall(contract, method, params, nonce, delegateCall, overrides);
  return executeTxWithSigners(safe, tx, signers);
}

function buildSafeTransaction(template) {
  return {
    to: template.to,
    value: template.value || 0,
    data: template.data || "0x",
    operation: template.operation || 0,
    safeTxGas: template.safeTxGas || 0,
    baseGas: template.baseGas || 0,
    gasPrice: template.gasPrice || 0,
    gasToken: template.gasToken || AddressZero,
    refundReceiver: template.refundReceiver || AddressZero,
    nonce: template.nonce
  }
}

async function chainId() { return (await hre.ethers.provider.getNetwork()).chainId }

async function getDeployedContracts() {
  if (_deployedContracts) {
    return _deployedContracts;
  }

  const GnosisSafeProxyFactory = await ethers.getContractFactory("GnosisSafeProxyFactory");
  const gnosisSafeFactory = await GnosisSafeProxyFactory.deploy();
  await gnosisSafeFactory.deployed();
  
  const GnosisSafe = await ethers.getContractFactory("GnosisSafe");
  const gnosisSafe = await GnosisSafe.deploy();
  await gnosisSafe.deployed();
  
  _deployedContracts = {
    "GnosisSafeProxyFactoryAddress": gnosisSafeFactory.address,
    "GnosisSafeDeployedAddress": gnosisSafe.address,
  };
  return _deployedContracts;
}

async function createSafeFor(signers, requiredConfirmations) {
  
  const signersAddresses = signers.map(signer => signer.address);
  requiredConfirmations = requiredConfirmations || signersAddresses.length;
  
  // get deployed GnosisSafe Master Copy
  const GnosisSafeFactory = await ethers.getContractFactory("GnosisSafe");
  const deployedContracts = await getDeployedContracts();
  const gnosisSafeContract = GnosisSafeFactory.attach(deployedContracts.GnosisSafeDeployedAddress);

  // prepare setup params
  const params = [
    signersAddresses,
    requiredConfirmations,
    AddressZero,
    "0x",
    AddressZero, // default fallback handler address
    AddressZero,
    0,
    AddressZero
  ];
  const setupParams = gnosisSafeContract.interface.encodeFunctionData("setup", params);

  // get deployed GnosisSafeProxyFactory
  const ProxyFactory = await ethers.getContractFactory("GnosisSafeProxyFactory");
  const ProxyFactoryContract = ProxyFactory.attach(deployedContracts.GnosisSafeProxyFactoryAddress);

  // create 2of3 GnosisSafe
  const txResponse = await ProxyFactoryContract.createProxy(gnosisSafeContract.address, setupParams);
  const txReceipt = await txResponse.wait();

  const abi = ["event ProxyCreation(address proxy, address singleton)"];
  const iface = new ethers.utils.Interface(abi);
  const eventsLog = iface.parseLog(txReceipt.events[1])
  const { proxy, singleton } = eventsLog.args;
  const safe = GnosisSafeFactory.attach(proxy);

  return safe;
}

module.exports = {
  executeContractCallWithSigners,
  createSafeFor
}
