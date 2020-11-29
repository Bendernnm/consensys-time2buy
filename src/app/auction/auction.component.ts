import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../core/services/web3/web3.service';

interface Lot {
  name: string;
  description: string;
  image: string;
  currentPrice: number;
  buyer: string;
}

interface AuctionsDetails {
  lot: Lot;
  status: string;
  seller: string;
  auctionAddress: string;
}

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  public currentAccount: string;
  public auctionsDetails: AuctionsDetails[];

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    this.currentAccount = this.web3Service.account;

    const storeAddresses: string[] = await this.web3Service.getStores();

    const allAuctionsAddresses: string[][] = await Promise.all(
      storeAddresses.map(storeAddress => this.web3Service.getAuctionsAddresses(storeAddress))
    );

    const auctionsAddresses: string[] = allAuctionsAddresses.reduce((result: string[], addresses: string[]) => {
      result.push(...addresses);

      return result;
    }, []);

    this.auctionsDetails = await Promise.all(
      auctionsAddresses.map(address =>
        this.web3Service.getAuctionDetails(address)
          .then(([lot, status, seller]: [Lot, string, string]) => ({
            lot,
            status,
            seller,
            auctionAddress: address,
          }))
      )
    );
  }

  public bet(auctionAddress: string, amount: number) {
    return this.web3Service.auctionBet(auctionAddress, amount);
  }

  public finish(auctionAddress: string) {
    return this.web3Service.auctionFinish(auctionAddress);
  }

}
