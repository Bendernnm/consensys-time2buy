import Web3 from 'web3';
import { Injectable } from '@angular/core';

import { WindowRefService } from '../window-ref/window-ref.service';
import { EventEmitter } from '../../../shared/helpers/event-emitter';
import contractData from '../../../shared/contract';
import { Contract } from 'web3-eth-contract';

@Injectable()
export class Web3Service extends EventEmitter {
  private web3: Web3;

  public account: string;
  public balance: string;

  private accountType: string;

  public storeAddress: string;

  private marketplaceContract: Contract;
  private contractOwner: string;

  private stores: Map<string, Contract> = new Map<string, Contract>();
  private auctions: Map<string, Contract> = new Map<string, Contract>();
  private erc20Contract: Contract;

  constructor(private windowRefService: WindowRefService) {
    super();

    if (typeof this.windowRefService.nativeWindow.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');

      this.web3 = new Web3(Web3.givenProvider);

      this.marketplaceContract = new this.web3.eth.Contract(contractData.marketplace.abi, contractData.marketplace.address);

      return;
    }

    console.error('Metamask not found');
  }

  async changeAccount(account): Promise<[string, string]> {
    this.account = account;
    this.balance = await this.web3.eth.getBalance(this.account);
    this.accountType = await this.getAccountType(this.account);

    if (this.accountType === '3') {
      this.storeAddress = await this.getStoreBySellerAddress(this.account);
    }

    this.emit('changeAccount', [this.account, this.balance]);

    return [this.account, this.balance];
  }

  async connectAccount(): Promise<[string, string]> {
    const accounts = await this.windowRefService.nativeWindow.ethereum.request({method: 'eth_requestAccounts'});

    this.contractOwner = await this.marketplaceContract.methods.owner().call();

    return this.changeAccount(accounts[0]);
  }

  onAccountChange() {
    this.windowRefService.nativeWindow.ethereum.on('accountsChanged', accounts => this.changeAccount(accounts[0]));
  }

  isNotRegistered() {
    return this.accountType === '0';
  }

  isOwner() {
    return this.account === this.contractOwner.toLowerCase();
  }

  isSeller() {
    return this.accountType === '3';
  }

  isAdmin() {
    return this.accountType === '4';
  }

  getPotentialSellersLimit() {
    return this.marketplaceContract.methods.potentialSellersLimit().call({
      from: this.account
    });
  }

  setPotentialSellersLimit(value) {
    return this.marketplaceContract.methods.changePotentialSellersLimit(value).send({
      from: this.account
    });
  }

  getAllowBecamePotentialSeller() {
    return this.marketplaceContract.methods.allowBecamePotentialSellers().call({
      from: this.account
    });
  }

  setAllowBecamePotentialSeller(value) {
    return this.marketplaceContract.methods.managePossibilityToBecomePotentialSeller(value).send({
      from: this.account
    });
  }

  setStoppedValue(value) {
    return this.marketplaceContract.methods.setStopValue(value).send({
      from: this.account
    });
  }

  getAccountType(address: string) {
    return this.marketplaceContract.methods.getStatus(address).call({
      from: this.account
    });
  }

  addAdmin(address: string) {
    return this.marketplaceContract.methods.addAdmin(address).send({
      from: this.account
    });
  }

  becameSeller() {
    return this.marketplaceContract.methods.sendRequestToBecameSeller().send({
      from: this.account
    });
  }

  async getPotentialSellers(): Promise<string[]> {
    let index = 0;
    const result: string[] = [];
    let continueLoop = true;

    do {
      try {
        const potentialSeller = await this.marketplaceContract.methods.potentialSellers(index++).call();

        result.push(potentialSeller);
      } catch {
        continueLoop = false;
      }
    } while (continueLoop);

    return result;
  }

  approvePotentialSeller(address: string) {
    return this.marketplaceContract.methods.approvePotentialSeller(address).send({
      from: this.account
    });
  }

  rejectPotentialSeller(address: string) {
    return this.marketplaceContract.methods.rejectPotentialSeller(address).send({
      from: this.account
    });
  }

  blockPotentialSeller(address: string) {
    return this.marketplaceContract.methods.blockPotentialSeller(address).send({
      from: this.account
    });
  }

  addSeller(address: string) {
    return this.marketplaceContract.methods.addSeller(address).send({
      from: this.account
    });
  }

  async getStoreBySellerAddress(address: string) {
    return this.marketplaceContract.methods.getStoreBySellerAddress(address).call();
  }

  getStoreContract(storeAddress: string): Contract {
    let store = this.stores.get(storeAddress);

    if (store) {
      return store;
    }

    store = new this.web3.eth.Contract(contractData.store.abi, storeAddress);

    this.stores.set(storeAddress, store);

    return store;
  }

  ether2wei(ethers: number) {
    return this.web3.utils.toWei(ethers.toString());
  }

  wei2ether(weis: number) {
    return this.web3.utils.fromWei(weis.toString());
  }

  addProduct(storeAddress: string, {name, description, image, price}: { name: string, description: string, image: string, price: number }) {
    return this.getStoreContract(storeAddress).methods.addProduct(name, description, image, price).send({
      from: this.account
    });
  }

  getProductsCount(storeAddress: string) {
    return this.getStoreContract(storeAddress).methods.productsCount().call();
  }

  getProduct(storeAddress: string, id: number) {
    return this.getStoreContract(storeAddress).methods.getProduct(id).call()
      .then(product => product)
      .catch(() => null);
  }

  async getProducts(storeAddress: string) {
    const ids = [];
    const count = await this.getProductsCount(storeAddress);

    for (let i = 0; i < count; i++) {
      ids.push(i);
    }

    const products = await Promise.all(ids.map(id => this.getProduct(storeAddress, id)));

    return products.reduce((result, product, id) => {
      if (!product) {
        return result;
      }

      const price = this.wei2ether(product[3]);

      result.push({
        id,
        price,
        name: product[0],
        description: product[1],
        image: product[2]
      });

      return result;
    }, []);
  }

  removeProduct(storeAddress: string, id: number) {
    return this.getStoreContract(storeAddress).methods.removeProduct(id).send({
      from: this.account
    });
  }

  getStoreBalance(storeAddress: string) {
    return this.getStoreContract(storeAddress).methods.getBalance().call({
      from: this.account
    });
  }

  withdraw(storeAddress: string, balance: string) {
    return this.getStoreContract(storeAddress).methods.withdraw(balance).send({
      from: this.account,
    });
  }

  async getStores(): Promise<string[]> {
    let index = 0;
    const result: string[] = [];
    let continueLoop = true;

    do {
      try {
        const potentialSeller = await this.marketplaceContract.methods.storesAddress(index++).call();

        result.push(potentialSeller);
      } catch {
        continueLoop = false;
      }
    } while (continueLoop);

    return result;
  }

  getStoreName(storeAddress: string) {
    return this.getStoreContract(storeAddress).methods.name().call();
  }

  buy(storeAddress: string, productId: number, price: string) {
    this.getStoreContract(storeAddress).methods.buy(productId).send({
      from: this.account,
      value: price
    });
  }

  shareTokens(address: string, count: number) {
    this.marketplaceContract.methods.shareTokens(address, count).send({
      from: this.account
    });
  }

  getAuctionContract(auctionAddress: string): Contract {
    let auction = this.stores.get(auctionAddress);

    if (auction) {
      return auction;
    }

    auction = new this.web3.eth.Contract(contractData.auction.abi, auctionAddress);

    this.stores.set(auctionAddress, auction);

    return auction;
  }

  async getAuctionsAddresses(storeAddress: string) {
    const storeContract = this.getStoreContract(storeAddress);

    const auctionsCountResponse = await storeContract.methods.auctionsCount().call();

    const auctionsCount = +auctionsCountResponse;

    const promises = [];

    for (let i = 0; i < auctionsCount; i += 1) {
      promises.push(storeContract.methods.getAuction(i).call());
    }

    return Promise.all(promises);
  }

  getAuctionDetails(auctionAddress: string) {
    const auctionContract = this.getAuctionContract(auctionAddress);

    return Promise.all([
      auctionContract.methods.lot().call(),
      auctionContract.methods.status().call(),
      auctionContract.methods.seller().call()
    ]);
  }

  getAuctionsDetails(auctionAddresses: string[]) {
    return Promise.all(auctionAddresses.map(auctionAddress => this.getAuctionDetails(auctionAddress)));
  }

  auctionStart(storeAddress: string, productId: number) {
    return this.getStoreContract(storeAddress).methods.startAuction(productId, 10).send({
      from: this.account,
    });
  }

  async getErc20Contract() {
    if (!this.erc20Contract) {
      const erc20Address = await this.marketplaceContract.methods.erc20Contract().call();

      this.erc20Contract = new this.web3.eth.Contract(contractData.erc20.abi, erc20Address);
    }

    return this.erc20Contract;
  }

  auctionBet(auctionAddress: string, amount: number) {
    this.getErc20Contract()
      .then(contract =>
        contract.methods.approve(auctionAddress, amount).send({from: this.account}))
      .then(() => this.getAuctionContract(auctionAddress))
      .then(contract => contract.methods.bet(amount).send({from: this.account}));
  }

  auctionFinish(auctionAddress: string) {
    return this.getStoreContract(this.storeAddress).methods.finishAuction(auctionAddress).send({from: this.account});
  }
}
