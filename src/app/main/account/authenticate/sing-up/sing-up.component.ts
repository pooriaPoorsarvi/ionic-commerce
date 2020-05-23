import { AlertController } from '@ionic/angular';
import { AuthenticationService } from './../../../shared/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthenticationInfo } from 'src/app/main/shared/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss'],
})
export class SingUpComponent implements OnInit {

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(1)]),
    repeatedPassword: new FormControl('', [Validators.required, Validators.min(1), this.checkPasswords.bind(this)]),
    },
    );

  checkPasswords(c: AbstractControl): {[key: string]: any} | null {
    if (this === undefined || this.signUpForm === undefined ) {
      return null;
    }
    return c.value !== this.signUpForm.value.password ? { repeatedPassword : false} : null;
  }
  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  signUp() {
    this.authenticationService.singUpFromServer(this.signUpForm.value as AuthenticationInfo, this.presentAlert.bind(this));
  }

  async presentAlert(err: HttpErrorResponse) {
    const alert = await this.alertController.create({
      header: 'Sign up Error',
      message: err.error.message,
      buttons: ['OK']
    });
    this.signUpForm.reset();
    await alert.present();
  }

}
