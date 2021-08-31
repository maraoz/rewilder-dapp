// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract RewilderNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    function initialize() initializer public {
        __ERC721_init("RewilderNFT", "WILD");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    // https://docs.opensea.io/docs/metadata-standards
    // https://eips.ethereum.org/EIPS/eip-721#metadata
    // example: https://us-central1-wicked-apes.cloudfunctions.net/app/v1/200
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.rewilder.xyz/token/v1/";
    }

    function safeMint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
