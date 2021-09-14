// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./RewilderNFT.sol";

contract RewilderDonationCampaign is Initializable, PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {

    RewilderNFT private _nft;
    address payable private _wallet;

    event Donation(address donor, uint256 value, uint256 tokenID);

    function initialize(RewilderNFT nftAddress, address payable wallet) initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();

        _nft = nftAddress;
        _wallet = wallet;
        
        // give ownership of campaign to wallet (allows finalizing)
        transferOwnership(_wallet);
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

    /**
     * @dev Receives donation and mints new NFT for donor
     */
    function donate() public whenNotPaused payable {
        require(msg.value >= 1 ether, "Minimum donation is 1 ETH");
        require(msg.value <= 100 ether, "Maximum donation is 100 ETH");

        uint256 tokenId =_nft.safeMint(msg.sender);
        emit Donation(msg.sender, msg.value, tokenId);
        _wallet.transfer(msg.value);
    }

    /**
     * @dev finalize campaign and transfer NFT ownership after donation campaign ends
     */
    function finalize() public onlyOwner {
        _pause();
        _nft.transferOwnership(_wallet);
    }

    /**
     * @dev unpause the campaign
     */
    function unpause() public onlyOwner {
        _unpause();
    }

}
