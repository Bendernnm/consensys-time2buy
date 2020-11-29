import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { Web3Service } from './services/web3/web3.service';
import { AppRoutingModule } from '../app-routing.module';
import { WindowRefService } from './services/window-ref/window-ref.service';
import { AccountComponent } from './components/account/account.component';


@NgModule({
  declarations: [HeaderComponent, AccountComponent],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports: [
    HeaderComponent,
    AccountComponent,
  ],
  providers: [Web3Service, WindowRefService]
})
export class CoreModule {
}
