import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isOwner: boolean;
  public isSeller: boolean;
  public isAdmin: boolean;

  constructor(private web3: Web3Service,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.web3.on('changeAccount', () => {
      this.isOwner = this.web3.isOwner();
      this.isSeller = this.web3.isSeller();
      this.isAdmin = this.web3.isAdmin();

      this.changeDetectorRef.detectChanges();
    });

  }

}
