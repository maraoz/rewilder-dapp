const { Contract, Wallet, utils, BigNumber, BigNumberish, Signer, PopulatedTransaction } = require("ethers");
const { TypedDataSigner } = require("@ethersproject/abstract-signer");
const { AddressZero } = require("@ethersproject/constants");

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
  return safe.execTransaction(safeTx.to, safeTx.value, safeTx.data, safeTx.operation, safeTx.safeTxGas, safeTx.baseGas, safeTx.gasPrice, safeTx.gasToken, safeTx.refundReceiver, signatureBytes, {})
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

module.exports = {
  executeContractCallWithSigners,
  chainId,
}
