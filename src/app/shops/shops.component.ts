import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../core/services/web3/web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  public stores: { address: string, name: string }[];

  constructor(private router: Router,
              private web3Service: Web3Service) {
  }

  async ngOnInit() {
    const storesAddresses = await this.web3Service.getStores();

    this.stores = storesAddresses.map(address => ({
      address,
      name: address,
    }));

    this.stores.forEach((store) => this.web3Service.getStoreName(store.address).then(name => store.name = name));
  }

  shopDetails(address) {
    this.router.navigate(['shop', address]);
  }

}
