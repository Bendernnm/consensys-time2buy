import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShopsComponent } from './shops/shops.component';
import { CoreModule } from './core/core.module';
import { AuctionComponent } from './auction/auction.component';
import { MyShopComponent } from './my-shop/my-shop.component';
import { PotentialSellerComponent } from './potential-seller/potential-seller.component';
import { ConfigComponent } from './config/config.component';
import { ShopComponent } from './shop/shop.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ShopsComponent,
    AuctionComponent,
    MyShopComponent,
    PotentialSellerComponent,
    ConfigComponent,
    ShopComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
