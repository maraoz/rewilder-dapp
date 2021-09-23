const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");


describe("RewilderDonationCampaign", function () {
  
  let RewilderDonationCampaign;
  beforeEach(async function () {
    const [deployer, donorA, donorB, wallet] = await ethers.getSigners();
    this.deployer = deployer;
    this.donorA = donorA;
    this.donorB = donorB;
    this.wallet = wallet;
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    this.nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
    RewilderDonationCampaign = await ethers.getContractFactory("RewilderDonationCampaign");
    
    this.campaign = await RewilderDonationCampaign.deploy(
      this.nft.address, this.wallet.address);
    await this.campaign.deployed();
    
    // transfer nft ownership to donation campaign
    await this.nft.transferOwnership(this.campaign.address);
  });

  it("deploys", async function () {
    const campaign = await RewilderDonationCampaign.deploy(
      this.nft.address, this.wallet.address);
    await campaign.deployed();
  });

  it("throws on receiveDonation if can't transfer ETH to wallet", async function () {
    RejectsEther = await ethers.getContractFactory("RejectsEther");
    badWallet = await RejectsEther.deploy();
    await badWallet.deployed();

    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    const nft = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
    
    const brokenCampaign = await RewilderDonationCampaign.deploy(
      nft.address, badWallet.address);
    await brokenCampaign.deployed();
      
    await nft.transferOwnership(brokenCampaign.address);

    const donationAmountWEI = ethers.utils.parseEther("2.0");
    await expect(brokenCampaign.receiveDonation({value: donationAmountWEI}))
      .to.be.revertedWith('Transfer to wallet failed');
    
  });
    
  describe("constructs correctly", function () {
    it("stores nft address", async function () {
      expect(await this.campaign.nft()).to.equal(this.nft.address);
    });
    it("sets the right owner", async function () {
      expect(await this.campaign.owner()).to.equal(this.wallet.address);
    });
    it("has nft ownership", async function () {
      expect(await this.nft.owner()).to.equal(this.campaign.address);
    });
  });

  describe("donation call", function () {


    it("receives donation", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await expect(await this.campaign.receiveDonation({value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);
    });

    it("reject donation just below minimum, accept exact minimum", async function () {
      const justBelow1ETH = ethers.utils.parseEther("1.0").sub(1);
      await expect(this.campaign.receiveDonation(
        {value: justBelow1ETH})).to.be.revertedWith('Minimum donation is 1 ETH')

      const exactly1ETH = justBelow1ETH.add(1);
      await expect(await this.campaign.receiveDonation({value: exactly1ETH}))
      .to.changeEtherBalance(this.wallet, exactly1ETH);
    });

    it("reject donation below minimum", async function () {
      const donationAmountWEI = 1000;
      await expect(this.campaign.receiveDonation(
        {value: donationAmountWEI})).to.be.revertedWith('Minimum donation is 1 ETH')
    });

    it("reject donation above maximum", async function () {
      const above100ETH = ethers.utils.parseEther("150");
      await expect(this.campaign.receiveDonation(
        {value: above100ETH})).to.be.revertedWith('Maximum donation is 100 ETH')
    });

    it("reject donation just above maximum, accept exact maximum", async function () {
      const justAbove100ETH = ethers.utils.parseEther("100").add(1);
      await expect(this.campaign.receiveDonation(
        {value: justAbove100ETH})).to.be.revertedWith('Maximum donation is 100 ETH')

      const exactly100ETH = justAbove100ETH.sub(1);
      await expect(await this.campaign.receiveDonation({value: exactly100ETH}))
      .to.changeEtherBalance(this.wallet, exactly100ETH);
    });

    it("accepts multiple donations from different donors", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      let preBalance = await ethers.provider.getBalance(this.wallet.address);
      // donor A
      await expect(await this.campaign.connect(this.donorA).receiveDonation({
        value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);
      // donor B
      await expect(await this.campaign.connect(this.donorB).receiveDonation({
        value: donationAmountWEI}))
        .to.changeEtherBalance(this.wallet, donationAmountWEI);
      // wallet should have 2 ETH more now
      expect(preBalance.add(ethers.utils.parseEther("2.0")))
        .to.equal(await ethers.provider.getBalance(this.wallet.address));
    });

    it("emits Donation events", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      const twoFour = ethers.utils.parseEther("2.4");
      await expect(await this.campaign.connect(this.donorA).receiveDonation({value: donationAmountWEI}))
        .to.emit(this.campaign, 'Donation')
        .withArgs(this.donorA.address, donationAmountWEI, 1);

      await expect(await this.campaign.connect(this.donorB).receiveDonation({value: twoFour}))
        .to.emit(this.campaign, 'Donation')
        .withArgs(this.donorB.address, twoFour, 2);
    });

    it("mints NFT for donor", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await this.campaign.connect(this.donorA).receiveDonation({value: donationAmountWEI});
      expect(await this.nft.ownerOf(1)).to.be.equal(this.donorA.address);
    });

    it("emits Transfer event from 0x", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await expect(await this.campaign.connect(this.donorA).receiveDonation({value: donationAmountWEI}))
        .to.emit(this.nft, 'Transfer')
        .withArgs(ethers.constants.AddressZero, this.donorA.address, 1);

      await expect(await this.campaign.connect(this.donorB).receiveDonation({value: donationAmountWEI}))
      .to.emit(this.nft, 'Transfer')
      .withArgs(ethers.constants.AddressZero, this.donorB.address, 2);
    });

    it("donor can then transfer the NFT", async function () {
      const donationAmountWEI = ethers.utils.parseEther("1.0");
      await this.campaign.connect(this.donorA).receiveDonation({value: donationAmountWEI});
      expect(await this.nft.ownerOf(1)).to.be.equal(this.donorA.address);

      await this.nft.connect(this.donorA).transferFrom(this.donorA.address, this.donorB.address, 1);
      expect(await this.nft.ownerOf(1)).to.be.equal(this.donorB.address);
    });
  });

  describe("pausable", function() {
    it("can only be paused by wallet", async function () {
      await expect(this.campaign.connect(this.deployer).pause())
        .to.be.revertedWith('Ownable: caller is not the owner')
      await expect(this.campaign.connect(this.donorA).pause())
        .to.be.revertedWith('Ownable: caller is not the owner')
      await this.campaign.connect(this.wallet).pause();
      expect(await this.campaign.paused()).to.equal(true);
    });

    it("can only be unpaused by wallet", async function () {
      await this.campaign.connect(this.wallet).pause();
      expect(await this.campaign.paused()).to.equal(true);
      await expect(this.campaign.connect(this.deployer).unpause())
        .to.be.revertedWith('Ownable: caller is not the owner')
      await expect(this.campaign.connect(this.donorA).unpause())
        .to.be.revertedWith('Ownable: caller is not the owner')
      await this.campaign.connect(this.wallet).unpause();
      expect(await this.campaign.paused()).to.equal(false);
    });
  })
  
  
  describe("finalize call", function () {
      
    it("starts unpaused", async function () {
      expect(await this.campaign.paused()).to.equal(false);
    });

    it("only wallet can finalize", async function () {
      await expect(this.campaign.finalize())
        .to.be.revertedWith('Ownable: caller is not the owner');

      await this.campaign.connect(this.wallet).finalize();
      expect(await this.campaign.paused()).to.equal(true);
    });

    describe("after finalized", async function() {
      beforeEach(async function () {
        await this.campaign.connect(this.wallet).finalize();
      });

      it("is paused", async function() {
        expect(await this.campaign.paused()).to.equal(true);
      })

      it("transfers ownership of NFT to multisig ", async function () {
        expect(await this.nft.owner()).to.equal(this.wallet.address);
      });
      
      it("disallows further donations", async function () {
        const donationAmountWEI = ethers.utils.parseEther("1.0");
        await expect(this.campaign.connect(this.donorA).receiveDonation({
          value: donationAmountWEI}))
          .to.be.revertedWith('Pausable: paused')
      });
      it("can only be unpaused by wallet", async function () {
        await expect(this.campaign.connect(this.deployer).unpause())
          .to.be.revertedWith('Ownable: caller is not the owner')
        await expect(this.campaign.connect(this.donorA).unpause())
          .to.be.revertedWith('Ownable: caller is not the owner')
        await this.campaign.connect(this.wallet).unpause();
        expect(await this.campaign.paused()).to.equal(false);
      });
    });
  });


});
