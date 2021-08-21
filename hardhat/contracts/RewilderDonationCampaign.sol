// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./RewilderNFT.sol";

contract RewilderDonationCampaign is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    RewilderNFT public nft;

    event Donation(address donor, uint256 value);

    function initialize(RewilderNFT nftAddress) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();

        nft = nftAddress;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    // TODO: add min and max donation check
    // TODO: forward funds to rewilder multisig
    function donate() public payable {
        require(msg.value >= 1 ether, "Minimum donation is 1 ETH");
        emit Donation(msg.sender, msg.value);
        nft.safeMint(msg.sender);
    }
}
