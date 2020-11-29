import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopsComponent } from './shops/shops.component';
import { AuctionComponent } from './auction/auction.component';
import { MyShopComponent } from './my-shop/my-shop.component';
import { PotentialSellerComponent } from './potential-seller/potential-seller.component';
import { ConfigComponent } from './config/config.component';
import { ShopComponent } from './shop/shop.component';


const routes: Routes = [
  {path: '', redirectTo: 'shops', pathMatch: 'prefix'},
  {path: 'shops', component: ShopsComponent, pathMatch: 'prefix'},
  {path: 'auction', component: AuctionComponent, pathMatch: 'prefix'},
  {path: 'my-shop', component: MyShopComponent, pathMatch: 'prefix'},
  {path: 'potential-sellers', component: PotentialSellerComponent, pathMatch: 'prefix'},
  {path: 'config', component: ConfigComponent, pathMatch: 'prefix'},
  {path: 'shop/:id', component: ShopComponent, pathMatch: 'prefix'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
