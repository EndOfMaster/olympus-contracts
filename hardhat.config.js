require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

const alchemyKey = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.7.5",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyKey}`,
      accounts: [`${privateKey}`],
      gas: 8000000,
    },
  }
};
