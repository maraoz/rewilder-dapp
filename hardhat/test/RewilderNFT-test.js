const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("RewilderNFT", function () {
  it("deploys with upgrades", async function () {
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  });

  describe("ERC20", function () {
    beforeEach(async function () {
      const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
      this.token = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
    });
    it("has correct symbol", async function () {
      expect(await this.token.symbol()).to.equal("WILD");
    });
  });

  describe("upgrades", function () {
    beforeEach(async function () {
      const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
      this.token = await upgrades.deployProxy(RewilderNFT, {
        kind: "uups",
        initializer: "initialize",
      });
    });

    it("upgrades to v2 implementation and preserves address", async function () {
      const MockRewilderNFTv2 = await ethers.getContractFactory(
        "MockRewilderNFTv2"
      );
      const upgradedNFT = await upgrades.upgradeProxy(
        this.token.address,
        MockRewilderNFTv2
      );
      expect(upgradedNFT.address).to.equal(this.token.address);
    });

    it.skip("upgrades to v2 implementation that changes symbol", async function () {
      const MockRewilderNFTv2 = await ethers.getContractFactory(
        "MockRewilderNFTv2"
      );
      const upgradedNFT = await upgrades.upgradeProxy(
        this.token.address,
        MockRewilderNFTv2
      );
      //await upgradedNFT.initialize();
      const newSymbol = await upgradedNFT.symbol();
      const oldSymbol = await this.token.symbol();
      expect(newSymbol).to.not.equal(oldSymbol);
    });
  });
});
