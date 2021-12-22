const hre = require("hardhat");

async function main() {
  // get the contract to deploy
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");

  // deploy the nft
  const simpleNft = await SimpleNFT.deploy();
  console.log("SimpleNFT deployed to:", simpleNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
