require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
// MNEMONIC_PHRASE and INFURA_KEY are mentioned in .env file
const mnemonic = process.env.MNEMONIC_PHRASE;
const infuraKey = process.env.INFURA_KEY;

module.exports = {

  contracts_build_directory: "./src/abis/",
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    "ropsten-infura": {
      provider: () => new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/v3/' + infuraKey, 0),
      network_id: 3,
      gas: 5500000,
      gasPrice: 100000000000,
      timeoutBlocks: 200,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.7.6",
    }
  }
};
