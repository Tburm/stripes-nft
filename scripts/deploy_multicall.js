const hre = require("hardhat");

async function main() {
  // get the contract to deploy
  const Multicall = await hre.ethers.getContractFactory("Multicall");

  // then deploy the contract
  const multicall = await Multicall.deploy();

  console.log("Multicall deployed to:", multicall.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
