const { ethers } = require("hardhat");
const { expect } = require("chai");
const { executeContractCallWithSigners, createSafeFor } = require("./utils/gnosis-utils");
const donationAmountWEI = ethers.utils.parseEther("1.0");

describe("GnosisSafe", function () {
  before(async function () {
    const [signer1, signer2, signer3, donorA, donorB, donorC, signer4, signer5, signer6] = await ethers.getSigners();
    this.signer1 = signer1;
    this.signer2 = signer2;
    this.signer3 = signer3;
    this.donorA = donorA;
    this.donorB = donorB;
    this.donorC = donorC;
    this.signer4 = signer4;
    this.signer5 = signer5;
    this.signer6 = signer6;
  });

  beforeEach(async function () { 
    this.campaignSafe = await createSafeFor([signer1, signer2, signer3], 2);
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    this.nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
    RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
    this.campaign = await RewilderDonationCampaign.deploy(this.nft.address, this.campaignSafe.address);
    await this.campaign.deployed();
    await this.nft.transferOwnership(this.campaign.address);
  });

  describe("constructs correctly", function () {
    it("sets the right owner", async function () {
      expect(await this.campaign.owner()).to.equal(this.campaignSafe.address)
    });
    it("has nft ownership", async function () {
      expect(await this.nft.owner()).to.equal(this.campaign.address);
    });
  });

  describe("donation call", function () {
    it("accepts multiple donations from different donors", async function () {
      let preBalance = await ethers.provider.getBalance(this.campaignSafe.address);

      expect(await this.nft.balanceOf(this.donorA.address)).to.equal(0);
      await this.campaign.connect(this.donorA).receiveDonation({ value: donationAmountWEI });
      expect(await ethers.provider.getBalance(this.campaignSafe.address)).to.equal(preBalance.add(donationAmountWEI));
      expect(await this.nft.balanceOf(this.donorA.address)).to.equal(1);

      expect(await this.nft.balanceOf(this.donorB.address)).to.equal(0);
      await this.campaign.connect(this.donorB).receiveDonation({ value: donationAmountWEI });
      expect(await ethers.provider.getBalance(this.campaignSafe.address)).to.equal(preBalance.add(ethers.utils.parseEther("2.0")));
      expect(await this.nft.balanceOf(this.donorB.address)).to.equal(1);
    });

    it("accepts donations from a gnosis safe account", async function () {
      const donorSafe = await createSafeFor([this.signer4, this.signer5, this.signer6], 2);
      await this.signer1.sendTransaction({ to: donorSafe.address, value: ethers.utils.parseEther("150.0") });
      expect(await this.nft.balanceOf(donorSafe.address)).to.equal(0);

      await executeContractCallWithSigners(donorSafe, this.campaign, "receiveDonation", [], [this.signer4, this.signer5], false, { value: donationAmountWEI });
      expect(await this.nft.balanceOf(donorSafe.address)).to.equal(1);
    });
  });

  describe("pausable", function () {
    it("can be paused by a gnosis safe", async function () {
      await executeContractCallWithSigners(this.campaignSafe, this.campaign, "pause", [], [this.signer1, this.signer2], false, {});
      expect(await this.campaign.paused()).to.equal(true);
    });

    describe("when paused", function () {
      beforeEach(async function () {
        await executeContractCallWithSigners(this.campaignSafe, this.campaign, "pause", [], [this.signer1, this.signer2], false, {});
      });

      it("reverts donations when paused", async function () {
        await expect(this.campaign.connect(this.donorA).receiveDonation({ value: donationAmountWEI })).to.be.revertedWith('Pausable: paused')
      });

      it("can only be unpaused by the gnosis safe", async function () {
        await expect(this.campaign.connect(this.donorA).unpause()).to.be.revertedWith('Ownable: caller is not the owner');

        await executeContractCallWithSigners(this.campaignSafe, this.campaign, "unpause", [], [this.signer2, this.signer3], false, {});
        expect(await this.campaign.paused()).to.equal(false);
      });

      it("allows for donations and mints NFTs again when unpaused", async function () {
        expect(await this.nft.balanceOf(this.donorC.address)).to.equal(0);
        await executeContractCallWithSigners(this.campaignSafe, this.campaign, "unpause", [], [this.signer2, this.signer3], false, {});

        await this.campaign.connect(this.donorC).receiveDonation({ value: donationAmountWEI });
        expect(await this.nft.balanceOf(this.donorC.address)).to.equal(1);
      });
    });
  });

  describe("finalize call", function () {
    beforeEach(async function () {
      await executeContractCallWithSigners(this.campaignSafe, this.campaign, "finalize", [], [this.signer1, this.signer2], false, {});
    });

    it("gnosis safe can finalize the campaign", async function () {
      expect(await this.campaign.paused()).to.equal(true);
    });

    it("gnosis safe gets ownership of the toke", async function () {
      expect(await this.nft.owner()).to.equal(this.campaignSafe.address);
    });

    it("reverts further donations", async function () {
      await expect(this.campaign.connect(this.donorA).receiveDonation({
        value: donationAmountWEI
      })).to.be.revertedWith('Pausable: paused')
    });
  });
});
