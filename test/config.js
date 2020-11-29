const Config = artifacts.require('./Config.sol');

contract('Auction', (accounts) => {
  let configContract;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    ([alice, bob, john] = accounts);

    configContract = await Config.new({ from: alice });
  });

  it('should set stop flag', async () => {
    let threw = false;

    try {
      await configContract.setStopValue(true, { from: alice });
    } catch (err) {
      threw = true;
    }

    expect(threw).to.equal(false);
  });

  it('should change potential seller limit', async () => {
    const newPotentialSellerLimit = 10;

    await configContract.changePotentialSellersLimit(newPotentialSellerLimit,
        { from: alice });

    const potentialSellerLimit = await configContract.potentialSellersLimit.call();

    expect(potentialSellerLimit.toNumber()).to.equal(newPotentialSellerLimit);
  });

  it('should throw error, cause only owner can change potential seller limit',
      async () => {
        let threw = false;

        try {
          await configContract.changePotentialSellersLimit(1, { from: bob });
        } catch (err) {
          expect(err.reason).to.equal('Ownable: caller is not the owner');

          threw = true;
        }

        expect(threw).to.equal(true);
      });

  it('should off possibility to became seller', async () => {
    await configContract.managePossibilityToBecomePotentialSeller(false);

    const canBecameSeller = await configContract.allowBecamePotentialSellers.call();

    expect(canBecameSeller).to.equal(false);
  });
});
