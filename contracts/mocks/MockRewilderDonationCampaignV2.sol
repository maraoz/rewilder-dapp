// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../RewilderNFT.sol";

contract MockRewilderDonationCampaignV2 is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    RewilderNFT public _nft;
    address payable private _wallet;

    event Donation(address donor, uint256 value);

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    function nft() public view virtual returns (RewilderNFT) {
        return _nft;
    }

}