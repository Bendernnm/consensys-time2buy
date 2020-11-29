import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3/web3.service';
import { WindowRefService } from '../../services/window-ref/window-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public address: string;
  public balance: string;
  public isNotRegistered: boolean;

  private accountUploaded = false;

  constructor(private web3Service: Web3Service,
              private router: Router,
              private windowRefService: WindowRefService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  async ngOnInit() {
    this.web3Service.on('changeAccount', async (data) => {
      ([this.address, this.balance] = data);

      this.isNotRegistered = this.web3Service.isNotRegistered();

      this.changeDetectorRef.detectChanges();

      if (this.accountUploaded) {
        await this.router.navigate(['']);
        return this.windowRefService.nativeWindow.location.reload();
      }

      this.accountUploaded = true;
    });
  }

  public async becameSeller() {
    await this.web3Service.becameSeller();
  }

}
