const Seller = artifacts.require('./Sellers.sol');
const ERC20 = artifacts.require('./ERC20.sol');

contract('Seller', (accounts) => {
  let sellerContract;
  let erc20Contract;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    ([alice, bob, john] = accounts);

    sellerContract = await Seller.new({ from: alice });
  });

  it('should approve potential seller', async () => {
    await sellerContract.sendRequestToBecameSeller({ from: bob });

    await sellerContract.approvePotentialSeller(bob, { from: alice });

    const status = await sellerContract.getStatus(bob);

    expect(status.toNumber()).to.equal(3);
  });

  it('should add new seller by address', async () => {
    await sellerContract.addSeller(bob);

    const status = await sellerContract.getStatus(bob);

    expect(status.toNumber()).to.equal(3);
  });

  it('should throw, error when no admin try to add seller', async () => {
    let threw = false;

    await sellerContract.sendRequestToBecameSeller({ from: bob });

    try {
      await sellerContract.approvePotentialSeller(bob, { from: john });
    } catch (err) {
      threw = true;

      expect(err.reason).to.equal('Wrong status of user');
    }

    expect(threw).to.equal(true);
  });

  it('should return store by seller address', async () => {
    await sellerContract.addSeller(bob);

    const status = await sellerContract.getStatus(bob);

    expect(status.toNumber()).to.equal(3);

    const [storeAddress, storeAddressBySeller] = await Promise.all([
      sellerContract.storesAddress.call(0),
      sellerContract.getStoreBySellerAddress(bob),
    ]);

    expect(storeAddress).to.equal(storeAddressBySeller);
  });
});
