require("@nomiclabs/hardhat-waffle");
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  networks: {
    //Moonbase Alpha network 
    moonbase: {
      url: 'https://rpc.testnet.moonbeam.network',
      chainId: 1287, 
      accounts: ["799ff370be0c224f7ff34edbdb049a359316c0aa5f2d1691048cebee62a7ed21"]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../Front-End/src/artifacts"
  }
};

