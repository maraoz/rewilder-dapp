// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// Required for triggering execution
import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";
import "@gnosis.pm/safe-contracts/contracts/GnosisSafe.sol";
import "@gnosis.pm/safe-contracts/contracts/proxies/GnosisSafeProxyFactory.sol";

contract ExampleModule {
    function tokenTransfer(GnosisSafe safe, address token, address to, uint amount) public {
        bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", to, amount);
        require(safe.execTransactionFromModule(token, 0, data, Enum.Operation.Call), "Could not execute token transfer");
    }
}
