const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config({path: __dirname + '/.env'})

const mnemonic = process.env['MNEMONIC'];
const apikey = process.env['API_KEY'];
module.exports = {
  compilers: {
    solc: {
      version: "0.7.6",
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${apikey}`)
      },
      network_id: 1
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${apikey}`)
      },
      network_id: 3
    }
  }
};
