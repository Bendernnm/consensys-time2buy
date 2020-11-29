const Store = artifacts.require('./Store.sol');
const ERC20 = artifacts.require('./ERC20.sol');

contract('Store', (accounts) => {
  let storeContract;
  let erc20Contract;

  let total;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    total = 20000;
    ([alice, bob, john] = accounts);

    erc20Contract = await ERC20.new(total, { from: alice });
    storeContract = await Store.new(alice, erc20Contract.address);
  });

  it('should change name by sell', async () => {
    const newStoreName = 'New store';

    await storeContract.changeName(newStoreName);

    const storeName = await storeContract.name.call();

    expect(storeName).to.equal(newStoreName);
  });

  it('should add new product', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const price = 10;

    await storeContract.addProduct(name, description, image, price);

    const product = await storeContract.products.call(0);

    expect(product.name).to.equal(name);
    expect(product.description).to.equal(description);
    expect(product.image).to.equal(image);
    expect(product.price.toNumber()).to.equal(price);
  });

  it('should sell product for user', async () => {
    let err = null;
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const price = 3;

    await storeContract.addProduct(name, description, image, price);

    await storeContract.buy(0, { from: bob, value: price });

    const balance = await storeContract.getBalance({ from: alice });

    expect(balance.toNumber()).to.equal(price);

    try {
      await storeContract.withdraw(price, { from: alice });
    } catch (_err) {
      err = _err;
    }

    expect(err).to.equal(null);
  });

  it('should remove product', async () => {
    const name = 'n1';
    const description = 'desc';
    const image = 'http://';
    const price = 10;

    await storeContract.addProduct(name, description, image, price);

    let product = await storeContract.products.call(0);

    expect(product.name).to.equal(name);
    expect(product.description).to.equal(description);
    expect(product.image).to.equal(image);
    expect(product.price.toNumber()).to.equal(price);

    await storeContract.removeProduct(0);

    product = await storeContract.products.call(0);

    expect(product.name).to.equal('');
    expect(product.description).to.equal('');
    expect(product.image).to.equal('');
    expect(product.price.toNumber()).to.equal(0);
  });
});
