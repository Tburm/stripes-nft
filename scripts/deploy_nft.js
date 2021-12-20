const hre = require("hardhat");
traitsToAdd = require("../data/traits/customoose_traits_add.json");

async function addTraits(metisNft, traitLibrary) {
  console.log("Adding traits...")
  var txs = [];
  for (let [index, value] of traitsToAdd.slice(0, 9).entries()) {
    let tx = await traitLibrary.addTraits(
      value.index,
      value.traits
    )
    tx = await tx.wait()
    txs.push(tx)
  }
  await Promise.all(txs).then((txs) => {
    var totalGas = 0;
    txs.map((tx) => {
      console.log(tx.transactionHash, tx.gasUsed.toNumber())
      totalGas += tx.gasUsed.toNumber()
    })
    console.log('Total trait gas: ', totalGas)
  }).catch((err) => {
    console.log(err)
  })
}

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

  // await addTraits(metisNft, traitLibrary)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
