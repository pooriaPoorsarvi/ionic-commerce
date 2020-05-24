import { AccountDetailComponent } from './authenticated/account-detail/account-detail.component';
import { OrdersComponent } from './authenticated/orders/orders.component';
import { SingUpComponent } from './authenticate/sing-up/sing-up.component';
import { LoginComponent } from './authenticate/login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    AccountPage,
    AuthenticatedComponent,
    AuthenticateComponent,
    LoginComponent,
    SingUpComponent,
    AccountDetailComponent,
    OrdersComponent
  ]
})
export class AccountPageModule {}
