import { SingUpComponent } from './authenticate/sing-up/sing-up.component';
import { LoginComponent } from './authenticate/login/login.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  declarations: [AccountPage, AuthenticatedComponent, AuthenticateComponent, LoginComponent, SingUpComponent]
})
export class AccountPageModule {}
