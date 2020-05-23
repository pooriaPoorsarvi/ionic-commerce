import { AuthenticationService } from './../../../shared/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {}


  login() {
    this.authenticationService.authenticateFromServer(this.signUpForm.value, this.presentAlert.bind(this));
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Authentication Error',
      message: 'Either the user name or the password was wrong',
      buttons: ['OK']
    });
    this.signUpForm.reset();
    await alert.present();
  }

}
