import { Component } from '@angular/core';
import { Web3Service } from './core/services/web3/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'time2buy-v1';

  constructor(private web3Service: Web3Service) {
    this.web3Service.connectAccount()
      .then(() => this.web3Service.onAccountChange())
      .catch((err) => {
        console.error('Something went wrong...');
        console.error(err);
      });
  }
}
