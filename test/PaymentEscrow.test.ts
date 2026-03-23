import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PaymentEscrow", function () {
  async function deployFixture() {
    const [buyer, seller, stranger] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PaymentEscrow");
    const escrow = await factory.deploy();
    await escrow.waitForDeployment();

    return { escrow, buyer, seller, stranger };
  }

  it("creates escrow and stores details", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await escrow
      .connect(buyer)
      .createEscrow(seller.address, "Website Design", 3600, { value: ethers.parseEther("1") });

    const tx = await escrow.getEscrow(0);
    expect(tx.buyer).to.equal(buyer.address);
    expect(tx.seller).to.equal(seller.address);
    expect(tx.amount).to.equal(ethers.parseEther("1"));
    expect(tx.status).to.equal(0n);
  });

  it("releases funds when buyer confirms delivery", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await escrow
      .connect(buyer)
      .createEscrow(seller.address, "Audit", 3600, { value: ethers.parseEther("0.5") });

    await expect(() => escrow.connect(buyer).confirmDelivery(0)).to.changeEtherBalance(
      seller,
      ethers.parseEther("0.5")
    );

    const tx = await escrow.getEscrow(0);
    expect(tx.status).to.equal(1n);
  });

  it("auto releases after timeout", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await escrow
      .connect(buyer)
      .createEscrow(seller.address, "App Dev", 120, { value: ethers.parseEther("0.25") });

    await time.increase(121);

    await expect(() => escrow.autoRelease(0)).to.changeEtherBalance(seller, ethers.parseEther("0.25"));

    const tx = await escrow.getEscrow(0);
    expect(tx.status).to.equal(1n);
  });

  it("allows buyer refund before timeout", async function () {
    const { escrow, buyer, seller } = await deployFixture();

    await escrow
      .connect(buyer)
      .createEscrow(seller.address, "Logo Design", 1800, { value: ethers.parseEther("0.2") });

    await expect(() => escrow.connect(buyer).requestRefund(0)).to.changeEtherBalance(
      buyer,
      ethers.parseEther("0.2")
    );

    const tx = await escrow.getEscrow(0);
    expect(tx.status).to.equal(2n);
  });

  it("prevents non-buyer from confirming delivery", async function () {
    const { escrow, buyer, seller, stranger } = await deployFixture();

    await escrow
      .connect(buyer)
      .createEscrow(seller.address, "Contract Work", 3600, { value: ethers.parseEther("1") });

    await expect(escrow.connect(stranger).confirmDelivery(0)).to.be.revertedWith("Only buyer allowed");
  });
});
