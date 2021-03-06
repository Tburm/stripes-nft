const hre = require("hardhat");

async function main() {
  // get the contract to deploy
  const Multicall = await hre.ethers.getContractFactory("Multicall");

  // then deploy the contract
  const multicall = await Multicall.deploy();

  console.log("Multicall deployed to:", multicall.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
