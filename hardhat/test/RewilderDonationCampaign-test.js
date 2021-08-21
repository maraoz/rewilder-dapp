const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");


describe("RewilderDonationCampaign", function () {

  beforeEach(async function () {
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    this.nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  });

  it("deploys with upgrades", async function () {
    const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
    const campaign = await upgrades.deployProxy(RewilderDonationCampaign, [this.nft.address], { kind: "uups" });
    await campaign.deployed();
  });

  describe("constructs correctly", function () {
    beforeEach(async function () {
      const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
      this.campaign = await upgrades.deployProxy(RewilderDonationCampaign, [this.nft.address], { kind: "uups" });
    });
    it("stores nft address", async function () {
      expect(await this.campaign.nft()).to.equal(this.nft.address);
    });


    describe("upgrades", function () {
      it("upgrades to v2 implementation and preserves address", async function () {
        const MockRewilderDonationCampaignV2 = await ethers.getContractFactory("MockRewilderDonationCampaignV2");
        const upgradedCampaign = await upgrades.upgradeProxy(
          this.campaign.address,
          MockRewilderDonationCampaignV2
        );
        expect(upgradedCampaign.address).to.equal(this.campaign.address);
      });

      it("upgrades to v2 implementation and preserves nft", async function () {
        const preUpgradeNFTAddress = await this.campaign.nft();

        const MockRewilderDonationCampaignV2 = await ethers.getContractFactory("MockRewilderDonationCampaignV2");
        const upgradedCampaign = await upgrades.upgradeProxy(
          this.campaign.address,
          MockRewilderDonationCampaignV2
        );
        expect(await upgradedCampaign.nft()).to.equal(preUpgradeNFTAddress);
      });

    });
  });

  describe("donation call", function () {
    beforeEach(async function () {
      const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
      this.campaign = await upgrades.deployProxy(RewilderDonationCampaign, [this.nft.address], { kind: "uups" });

      // transfer nft ownership to donation campaign
      await this.nft.transferOwnership(this.campaign.address);

    });

    it("receives donation", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await expect(await this.campaign.donate({value: donationAmountWEI}))
        .to.changeEtherBalance(this.campaign, donationAmountWEI);

    });

    it("reject donation below minimum", async function () {
      const donationAmountWEI = 1000;
      await expect(this.campaign.donate(
        {value: donationAmountWEI})).to.be.revertedWith('Minimum donation is 1 ETH')
    });

    it("emits Donation event", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await expect(await this.campaign.donate({value: donationAmountWEI}))
        .to.emit(this.campaign, 'Donation');
    });
    it.skip("mints NFT for donor", async function () {});
    it.skip("emits Transfer event from 0x", async function () {});
    it.skip("donor can then transfer the NFT", async function () {});
  });



});
