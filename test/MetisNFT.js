const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("MetisNFT", function () {
  it("Should mint a token", async function () {
    // get the contract to deploy
    const TraitLibrary = await hre.ethers.getContractFactory("TraitLibrary");
    const MetisNFT = await hre.ethers.getContractFactory("MetisNFT");

    // deploy traits first
    const traitLibrary = await TraitLibrary.deploy();
    await traitLibrary.deployed();

    // then deploy the nft
    const metisNFT = await MetisNFT.deploy(traitLibrary.address);

    let mintGas = await metisNFT.estimateGas.mint()
    let mintTx = await metisNFT.mint()

    mintTx = await mintTx.wait()

    console.log("Minting gas: ", mintGas.toNumber())
    console.log("Gas used: ", mintTx.gasUsed.toNumber())
  });

  it("Should produce valid SVG", async function () {
    // get the contract to deploy
    const TraitLibrary = await hre.ethers.getContractFactory("TraitLibrary")
    const MetisNFT = await hre.ethers.getContractFactory("MetisNFT")

    // deploy traits first
    const traitLibrary = await TraitLibrary.deploy()
    await traitLibrary.deployed()

    // then deploy the nft
    const metisNFT = await MetisNFT.deploy(traitLibrary.address)

    // mint one
    let mintTx = await metisNFT.mint()
    mintTx = await mintTx.wait()

    // get the svg
    let tokenConfig = await metisNFT._tokenIdToConfig(0)
    let tokenSvg = await metisNFT.configToSVG(tokenConfig)
    console.log(tokenSvg)

    let tokenSvgGas = await metisNFT.estimateGas.configToSVG(tokenConfig)
    console.log("SVG generation gas: ", tokenSvgGas.toNumber())
  });
  
  // it("Should print some byte stuff", async function () {
  //   // get the contract to deploy
  //   const TraitLibrary = await hre.ethers.getContractFactory("TraitLibrary");
  //   const MetisNFT = await hre.ethers.getContractFactory("MetisNFT");

  //   // deploy traits first
  //   const traitLibrary = await TraitLibrary.deploy();
  //   await traitLibrary.deployed();

  //   // then deploy the nft
  //   const metisNFT = await MetisNFT.deploy(traitLibrary.address);

  //   let printGas = await metisNFT.estimateGas.testBytes()
  //   console.log("Printing gas: ", printGas.toNumber())
  // });
});
