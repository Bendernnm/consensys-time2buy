import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../core/services/web3/web3.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-potential-seller',
  templateUrl: './potential-seller.component.html',
  styleUrls: ['./potential-seller.component.css']
})
export class PotentialSellerComponent implements OnInit {
  public potentialSellers: string[];

  public potentialSellerFormGroup: FormGroup;

  constructor(private web3Service: Web3Service) {
    this.initForm();
  }

  async ngOnInit() {
    this.potentialSellers = await this.web3Service.getPotentialSellers();
  }

  private initForm(): void {
    this.potentialSellerFormGroup = new FormGroup({
      address: new FormControl(''),
    });
  }

  public async addSeller() {
    const address: string = this.potentialSellerFormGroup.value.address;

    if (!address) {
      return;
    }

    return this.web3Service.addSeller(address);
  }

  public async approve(address: string) {
    return this.web3Service.approvePotentialSeller(address);
  }

  public async reject(address: string) {
    return this.web3Service.rejectPotentialSeller(address);
  }

  public async block(address: string) {
    return this.web3Service.blockPotentialSeller(address);
  }

}
