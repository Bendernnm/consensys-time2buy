import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from '../core/services/web3/web3.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public products: any[];
  private storeAddress: string;

  constructor(private web3Service: Web3Service,
              private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.storeAddress = this.route.snapshot.paramMap.get('id');

    this.products = await this.web3Service.getProducts(this.storeAddress);
  }

  async buy(productId: number, price: number) {
    return this.web3Service.buy(this.storeAddress, productId, this.web3Service.ether2wei(price));
  }

}
