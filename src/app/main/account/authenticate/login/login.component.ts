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

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {}


  login() {
    this.authenticationService.authenticateFromServer(this.loginForm.value, this.presentAlert.bind(this));
  }

  // TODO remove all the subscriptions every where in the code
  // TODO make sure that if the server is down they only get one message not multiple
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Authentication Error',
      message: 'Either the user name or the password was wrong',
      buttons: ['OK']
    });
    this.loginForm.reset();
    await alert.present();
  }

}
