import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Web3Service } from '../core/services/web3/web3.service';

enum Actions {
  SellerLimit = '0',
  AllowNewSellers = '1',
  Stopped = '2',
  AddAdmin = '3',
  ShareTokens = '4'
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public potentialSellersLimit: string;
  public allowBecamePotentialSellers: boolean;
  public stopped: boolean;
  public adminAddress: string;

  public configFormGroup: FormGroup;

  constructor(private web3Service: Web3Service) {
    this.initForm();
  }

  async ngOnInit() {
    ([
      this.potentialSellersLimit,
      this.allowBecamePotentialSellers
    ] = await Promise.all([
      this.web3Service.getPotentialSellersLimit(),
      this.web3Service.getAllowBecamePotentialSeller(),
    ]));

    this.configFormGroup.controls.potentialSellersLimit.setValue(+this.potentialSellersLimit);
    this.configFormGroup.controls.allowBecamePotentialSellers.setValue(+this.allowBecamePotentialSellers);
  }

  private initForm(): void {
    this.configFormGroup = new FormGroup({
      potentialSellersLimit: new FormControl(+this.potentialSellersLimit),
      allowBecamePotentialSellers: new FormControl(this.allowBecamePotentialSellers),
      stopped: new FormControl(false),
      adminAddress: new FormControl(''),
      address: new FormControl(''),
      tokensCount: new FormControl(0),
    });
  }

  public async change(action) {
    if (action === Actions.SellerLimit) {
      const newPotentialSellersLimit = this.configFormGroup.value.potentialSellersLimit;

      let currentPotentialSellersLimit = await this.web3Service.getPotentialSellersLimit();

      currentPotentialSellersLimit = +currentPotentialSellersLimit;

      if (newPotentialSellersLimit === currentPotentialSellersLimit) {
        return;
      }

      return this.web3Service.setPotentialSellersLimit(+newPotentialSellersLimit);
    }

    if (action === Actions.AllowNewSellers) {
      const newAllowBecamePotentialSellers = this.configFormGroup.value.potentialSellersLimit;

      const currentAllowBecamePotentialSellers = await this.web3Service.getAllowBecamePotentialSeller();

      if (newAllowBecamePotentialSellers === currentAllowBecamePotentialSellers) {
        return;
      }

      return this.web3Service.setAllowBecamePotentialSeller(+newAllowBecamePotentialSellers);
    }

    if (action === Actions.Stopped) {
      return this.web3Service.setStoppedValue(this.configFormGroup.value.stopped);
    }

    if (action === Actions.AddAdmin) {
      return this.web3Service.addAdmin(this.configFormGroup.value.adminAddress);
    }

    if (action === Actions.ShareTokens) {
      return this.web3Service.shareTokens(this.configFormGroup.value.address, this.configFormGroup.value.tokensCount);
    }
  }
}
