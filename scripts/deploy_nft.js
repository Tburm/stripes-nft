// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const TraitLibrary = await hre.ethers.getContractFactory("TraitLibrary");
  const MetisNFT = await hre.ethers.getContractFactory("MetisNFT");
  
  const traitLibrary = await TraitLibrary.deploy();
  await traitLibrary.deployed();

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
