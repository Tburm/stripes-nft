const hre = require("hardhat");

async function main() {
  // get the contract to deploy
  const TraitLibrary = await hre.ethers.getContractFactory("TraitLibrary");
  const MetisNFT = await hre.ethers.getContractFactory("MetisNFT");

  // deploy traits first
  const traitLibrary = await TraitLibrary.deploy();
  await traitLibrary.deployed();

  // then deploy the nft
  const metisNft = await MetisNFT.deploy(traitLibrary.address);

  console.log("TraitLibrary deployed to:", traitLibrary.address);
  console.log("MetisNFT deployed to:", metisNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
