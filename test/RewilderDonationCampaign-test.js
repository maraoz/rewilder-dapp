const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");


describe("RewilderDonationCampaign", function () {
  
  beforeEach(async function () {
    const [deployer, donorA, donorB, wallet] = await ethers.getSigners();
    this.deployer = deployer;
    this.donorA = donorA;
    this.donorB = donorB;
    this.wallet = wallet;
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    this.nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  });

  it("deploys with upgrades", async function () {
    const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
    const campaign = await upgrades.deployProxy(RewilderDonationCampaign, 
      [this.nft.address, this.wallet.address], { kind: "uups" });
    await campaign.deployed();
  });

  describe("constructs correctly", function () {
    beforeEach(async function () {
      const RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
      this.campaign = await upgrades.deployProxy(RewilderDonationCampaign, 
        [this.nft.address, this.wallet.address], { kind: "uups" });
    });
    it("stores nft address", async function () {
      expect(await this.campaign.nft()).to.equal(this.nft.address);
    });
    it("sets the right owner", async function () {
      expect(await this.campaign.owner()).to.equal(this.deployer.address);
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
      this.campaign = await upgrades.deployProxy(RewilderDonationCampaign, 
        [this.nft.address, this.wallet.address], { kind: "uups" });

      // transfer nft ownership to donation campaign
      await this.nft.transferOwnership(this.campaign.address);

    });

    it("receives donation", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await expect(await this.campaign.donate({value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);

    });

    it("reject donation just below minimum, accept exact minimum", async function () {
      const justBelow1ETH = ethers.utils.parseEther("1.0").sub(1);
      await expect(this.campaign.donate(
        {value: justBelow1ETH})).to.be.revertedWith('Minimum donation is 1 ETH')

      const exactly1ETH = justBelow1ETH.add(1);
      await expect(await this.campaign.donate({value: exactly1ETH}))
      .to.changeEtherBalance(this.wallet, exactly1ETH);
    });

    it("reject donation below minimum", async function () {
      const donationAmountWEI = 1000;
      await expect(this.campaign.donate(
        {value: donationAmountWEI})).to.be.revertedWith('Minimum donation is 1 ETH')
    });

    it("reject donation above maximum", async function () {
      const above100ETH = ethers.utils.parseEther("150");
      await expect(this.campaign.donate(
        {value: above100ETH})).to.be.revertedWith('Maximum donation is 100 ETH')
    });

    it("reject donation just above maximum, accept exact maximum", async function () {
      const justAbove100ETH = ethers.utils.parseEther("100").add(1);
      await expect(this.campaign.donate(
        {value: justAbove100ETH})).to.be.revertedWith('Maximum donation is 100 ETH')

      const exactly100ETH = justAbove100ETH.sub(1);
      await expect(await this.campaign.donate({value: exactly100ETH}))
      .to.changeEtherBalance(this.wallet, exactly100ETH);
    });

    it("accepts multiple donations from different donors", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      let preBalance = await ethers.provider.getBalance(this.wallet.address);
      // donor A
      await expect(await this.campaign.connect(this.donorA).donate({
        value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);
      // donor B
      await expect(await this.campaign.connect(this.donorB).donate({
        value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);
      // wallet should have 2 ETH more now
      expect(preBalance.add(ethers.utils.parseEther("2.0")))
        .to.equal(await ethers.provider.getBalance(this.wallet.address));
    });

    it("emits Donation events", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      const twoFour = ethers.utils.parseEther("2.4");
      await expect(await this.campaign.connect(this.donorA).donate({value: donationAmountWEI}))
        .to.emit(this.campaign, 'Donation')
        .withArgs(this.donorA.address, donationAmountWEI, 1);

      await expect(await this.campaign.connect(this.donorB).donate({value: twoFour}))
        .to.emit(this.campaign, 'Donation')
        .withArgs(this.donorB.address, twoFour, 2);
    });

    it("mints NFT for donor", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await this.campaign.connect(this.donorA).donate({value: donationAmountWEI});
      await expect(await this.nft.ownerOf(1)).to.be.equal(this.donorA.address);
    });

    it.skip("emits Transfer event from 0x", async function () {});
    it.skip("donor can then transfer the NFT", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await this.campaign.connect(this.donorA).donate({value: donationAmountWEI});
      await expect(await this.nft.ownerOf(1)).to.be.equal(this.donorA.address);

      await this.nft.transferFrom(this.donorA.address, this.donorB.address, 1);
      //await expect(await this.nft.ownerOf(1)).to.be.equal(this.donorB.address);
    });
    it.skip("campaign can transfer ownership of NFT to multisig", async function () {});
  });



});
