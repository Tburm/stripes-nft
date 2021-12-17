require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-solhint");
require('hardhat-abi-exporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_KEY,
      }
    },
    metis_test: {
      url: "https://stardust.metis.io/?owner=588",
      accounts:
        process.env.PRIVATE_KEY_METIS !== undefined ? [process.env.PRIVATE_KEY_METIS] : [],
    },
    metis: {
      url: "https://andromeda.metis.io/?owner=1088",
      accounts:
        process.env.PRIVATE_KEY_METIS !== undefined ? [process.env.PRIVATE_KEY_METIS] : [],
    }
  },
  
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },

  abiExporter: {
    path: './data/abi',
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  }
};
