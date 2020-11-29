import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Web3Service } from '../core/services/web3/web3.service';
import { WindowRefService } from '../core/services/window-ref/window-ref.service';

@Component({
  selector: 'app-my-shop',
  templateUrl: './my-shop.component.html',
  styleUrls: ['./my-shop.component.css']
})
export class MyShopComponent implements OnInit {
  // private ipfs: IPFS;
  public newProductForm: FormGroup;
  public products: any[];
  public balance = '0';
  public file: any;

  constructor(private web3Service: Web3Service,
              private windowRef: WindowRefService) {
    // this.ipfs = new IPFS({
    //   host: 'ipfs.infura.io',
    //   port: 5001,
    //   protocol: 'https',
    // });
    this.initForm();
  }

  async ngOnInit() {
    [this.products, this.balance] = await Promise.all([
      this.web3Service.getProducts(this.web3Service.storeAddress),
      this.web3Service.getStoreBalance(this.web3Service.storeAddress).then((balance) => this.web3Service.wei2ether(balance || 0)),
    ]);
  }

  private initForm() {
    this.newProductForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      image: new FormControl(''),
      price: new FormControl(1),
    });
  }

  private createProduct(product) {
    product.price = this.web3Service.ether2wei(this.newProductForm.value.price);

    return this.web3Service.addProduct(this.web3Service.storeAddress, product);
  }

  public addProduct() {
    if (!this.file) {
      return this.createProduct(this.newProductForm.value);
      // const product = this.newProductForm.value;
      //
      // product.price = this.web3Service.ether2wei(this.newProductForm.value.price);
      //
      // return this.web3Service.addProduct(this.web3Service.storeAddress, this.newProductForm.value);
    }

    // const reader = new this.windowRef.nativeWindow().FileReader();
    //
    // reader.readAsArrayBuffer(this.file);
    //
    // reader.onloadend = async () => {
    //   const buffer = new Buffer(reader.result);
    //
    //   const ipfsResponse = await this.ipfs.files.add(buffer);
    //
    //   console.log(ipfsResponse);
    //
    //   return this.createProduct({...this.newProductForm.value, image: ipfsResponse[0].hash});
    // };
  }

  public remove(id: number) {
    return this.web3Service.removeProduct(this.web3Service.storeAddress, id);
  }

  public add2auction(productId: number) {
    return this.web3Service.auctionStart(this.web3Service.storeAddress, productId);
  }

  public withdraw() {
    return this.web3Service.withdraw(this.web3Service.storeAddress, this.web3Service.ether2wei(+this.balance));
  }

  public onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.file = file;
    }
  }

}
