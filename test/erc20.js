const ERC20 = artifacts.require('./ERC20.sol');

contract('ERC20', (accounts) => {
  let contract;

  let total;

  let alice;
  let bob;
  let john;

  beforeEach(async () => {
    total = 20000;
    ([alice, bob, john] = accounts);

    contract = await ERC20.new(total);
  });

  it('should get total supply', async () => {
    const totalSupply = await contract.totalSupply();

    expect(totalSupply.toNumber()).to.equal(total);
  });

  it('should set all tokens to the owner after creation', async () => {
    const balanceOfOwner = await contract.balanceOf(alice);

    expect(balanceOfOwner.toNumber()).to.equal(total);
  });

  it('should transfer tokens from one account to the another', async () => {
    const sendAmount = 1000;

    await contract.transfer(bob, sendAmount, { from: alice });

    const [balanceOfAlice, balanceOfBob] = await Promise.all([
      contract.balanceOf(alice),
      contract.balanceOf(bob),
    ]);

    expect(balanceOfAlice.toNumber()).to.equal(total - sendAmount);
    expect(balanceOfBob.toNumber()).to.equal(sendAmount);
  });

  it('should approve tokens from one account to the another', async () => {
    const approveAmount = 1000;

    await contract.approve(bob, approveAmount);

    const allowanceFromAlice2Bob = await contract.allowance(alice, bob);

    expect(allowanceFromAlice2Bob.toNumber()).to.equal(approveAmount);
  });

  it('should approve tokens from one account to second and then transfer to third',
      async () => {
        const approveAmount = 1000;
        const transferAmount = 500;

        await contract.approve(bob, approveAmount, { from: alice });

        const allowanceFromAlice2Bob1 = await contract.allowance(alice, bob);

        expect(allowanceFromAlice2Bob1.toNumber()).to.equal(approveAmount);

        await contract.transferFrom(alice, john, transferAmount, { from: bob });

        const [
          balanceOfAlice,
          balanceOfBob,
          balanceOfJohn,
          allowanceFromAlice2Bob2,
        ] = await Promise.all([
          contract.balanceOf(alice),
          contract.balanceOf(bob),
          contract.balanceOf(john),
          contract.allowance(alice, bob),
        ]);

        expect(balanceOfAlice.toNumber()).to.equal(total - transferAmount);
        expect(balanceOfBob.toNumber()).to.equal(0);
        expect(balanceOfJohn.toNumber()).to.equal(transferAmount);
        expect(allowanceFromAlice2Bob2.toNumber())
            .to
            .equal(approveAmount - transferAmount);
      });
});
