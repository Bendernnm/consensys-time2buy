const Config = artifacts.require('./Config.sol');
const Users = artifacts.require('./Users.sol');
const ERC20 = artifacts.require('./ERC20.sol');

contract('Auction', (accounts) => {
  let usersContract;
  let erc20Contract;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    ([alice, bob, john] = accounts);

    usersContract = await Users.new({ from: alice });

    const erc20Address = await usersContract.erc20Contract.call();

    erc20Contract = await ERC20.at(erc20Address);
  });

  it('should get status of user', async () => {
    const status = await usersContract.getStatus(alice);

    expect(status.toNumber()).to.equal(4);
  });

  it('should share tokens', async () => {
    const sharedTokens = 1000;

    await usersContract.shareTokens(bob, sharedTokens);

    const balance = await erc20Contract.balanceOf(bob);

    expect(balance.toNumber()).to.equal(1000);
  });

  it('should add new admin', async () => {
    await usersContract.addAdmin(bob);

    const status = await usersContract.getStatus(bob);

    expect(status.toNumber()).to.equal(4);
  });

  it('should send request to became seller', async () => {
    await usersContract.sendRequestToBecameSeller({ from: bob });

    const status = await usersContract.getStatus(bob);

    expect(status.toNumber()).to.equal(2);
  });
});
