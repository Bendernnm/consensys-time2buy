const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;

module.exports = {
  migrations_directory: './migrations',
  compilers           : {
    solc: {
      version: '^0.6.0',
    },
  },
  networks            : {
    development: {
      host      : 'localhost',
      port      : 7545,
      network_id: '*', // Match any network id
      gas       : 6721975,
      gasPrice  : 20000000000,
    },
    rinkeby    : {
      provider     : function() {
        return new HDWalletProvider(MNEMONIC,
          `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
      },
      network_id   : 4,
    },
  },
};
