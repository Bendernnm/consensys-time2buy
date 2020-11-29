const ERC20 = artifacts.require('./ERC20.sol');
const Auction = artifacts.require('./Auction.sol');

contract('Auction', (accounts) => {
  let erc20Contract;
  let auctionContract;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    total = 20000;
    ([alice, bob, john] = accounts);

    erc20Contract = await ERC20.new(total, { from: alice });
    auctionContract = await Auction.new(alice, erc20Contract.address);
  });

  it('should init lot and set status equals 1', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const startPrice = 10;

    await auctionContract.start(name, description, image, startPrice);

    const [lot, status] = await Promise.all([
      auctionContract.lot.call(),
      auctionContract.status.call(),
    ]);

    expect(lot.name).to.equal(name);
    expect(lot.description).to.equal(description);
    expect(lot.image).to.equal(image);
    expect(lot.startPrice.toNumber()).to.equal(startPrice);
    expect(lot.currentPrice.toNumber()).to.equal(startPrice);
    expect(lot.buyer).to.equal(alice);
    expect(status.toNumber()).to.equal(1);
  });

  it('should user can send bet, then price and buyer will change', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const startPrice = 10;
    const betAmount = 50;

    await Promise.all([
      erc20Contract.transfer(bob, 1000, { from: alice }),
      auctionContract.start(name, description, image, startPrice),
    ]);

    await erc20Contract.approve(auctionContract.address, 50, { from: bob });
    await auctionContract.bet(betAmount, { from: bob });

    const lot = await auctionContract.lot.call();

    expect(lot.currentPrice.toNumber()).to.equal(betAmount);
    expect(lot.buyer).to.equal(bob);
  });

  it('should throw error if amount not enough', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const startPrice = 10;
    const betAmount = 5;

    await Promise.all([
      erc20Contract.transfer(bob, 1000, { from: alice }),
      auctionContract.start(name, description, image, startPrice),
    ]);

    await erc20Contract.approve(auctionContract.address, 50, { from: bob });

    try {
      await auctionContract.bet(betAmount, { from: bob });
    } catch (err) {
      expect(err.reason).to.equal('Not enough tokens');
    }
  });

  it('should throw error if it\'s not time for finishing', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const startPrice = 10;
    const betAmount = 50;

    await Promise.all([
      erc20Contract.transfer(bob, 1000, { from: alice }),
      auctionContract.start(name, description, image, startPrice),
    ]);

    await erc20Contract.approve(auctionContract.address, 50, { from: bob });
    await auctionContract.bet(betAmount, { from: bob });

    const lot = await auctionContract.lot.call();

    expect(lot.currentPrice.toNumber()).to.equal(betAmount);
    expect(lot.buyer).to.equal(bob);

    try {
      await auctionContract.finish({ from: alice });
    } catch (err) {
      expect(err.reason).to.equal("It's not time for finishing your auction");
    }
  });
});
