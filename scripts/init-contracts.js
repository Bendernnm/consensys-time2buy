const fs = require('fs');

const MarketplaceContract = require('../build/contracts/Marketplace.json');
const ERC20Contract = require('../build/contracts/ERC20.json');
const AuctionContract = require('../build/contracts/Auction.json');
const StoreContract = require('../build/contracts/Store');

const [, , addressEnv] = process.argv;

const address = addressEnv === 'deployed'
  ? JSON.parse(fs.readFileSync('deployed_addresses.json').toString()).address
  : MarketplaceContract.networks[5777].address;

const defaultObject = {
  marketplace: {
    address,
    abi: MarketplaceContract.abi,
  },
  store      : {
    abi: StoreContract.abi,
  },
  auction    : {
    abi: AuctionContract.abi,
  },
  erc20      : {
    abi: ERC20Contract.abi,
  },
};

fs.writeFileSync('src/app/shared/contract/index.js',
  Buffer.from(`export default ${JSON.stringify(defaultObject)}`));

console.log('Contracts updated!');
