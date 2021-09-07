// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./RewilderNFT.sol";

contract RewilderDonationCampaign is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    RewilderNFT private _nft;
    address payable private _wallet;

    event Donation(address donor, uint256 value);

    function initialize(RewilderNFT nftAddress, address payable wallet) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();

        _nft = nftAddress;
        _wallet = wallet;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    /**
     * @dev Returns the address of the NFT contract.
     */
    function nft() public view virtual returns (RewilderNFT) {
        return _nft;
    }


    // TODO: add max donation check
    /**
     * @dev Receives donation and mints new NFT for donor
     */
    function donate() public payable {
        require(msg.value >= 1 ether, "Minimum donation is 1 ETH");

        // TODO: return NFT id and add to Donation event
        _nft.safeMint(msg.sender);
        emit Donation(msg.sender, msg.value);
        _wallet.transfer(msg.value);
    }
}
