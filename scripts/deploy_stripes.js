const hre = require("hardhat");

async function main() {
  // get the contract to deploy
  const StripesNFT = await hre.ethers.getContractFactory("StripesNFT");

  // deploy the nft
  const stripesNFT = await StripesNFT.deploy();

  console.log("StripesNFT deployed to:", stripesNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
