import { AuthenticationModel, UserInfo } from './../../../shared/authentication.model';
import { AlertController } from '@ionic/angular';
import { AuthenticationService, UserUpdateInfo } from './../../../shared/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {

  authenticationModel: AuthenticationModel = this.authenticationService.getAuthenticationModel();
// TODO make sure if password is empty you don't send it to the server
  userDetailForm: FormGroup = new FormGroup({
    firstName: new FormControl(this.authenticationModel.getFirstName()),
    lastName: new FormControl(this.authenticationModel.getLastName()),
    email: new FormControl(this.authenticationModel.getEmail(), [Validators.required, Validators.email]),
    address: new FormControl(this.authenticationModel.getAddress()),
    password: new FormControl(''),
    oldPassword: new FormControl('', [Validators.required])
  });

  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.authenticationService.getAuthStream().subscribe(
      (auth: AuthenticationModel) => {
        this.authenticationModel = auth;
        this.setUpForm();
      }
    );
    this.setUpForm();
  }

  setUpForm() {
    let updatedInfo: UserInfo  = this.authenticationModel.getPersonalInfo();
    const listAttr = Object.keys(updatedInfo);
    listAttr.forEach(element => {
      this.userDetailForm.controls[element].setValue(updatedInfo[element]);
    });
  }

  logout() {
    this.authenticationService.logout();
  }

  saveEdits() {
    const currControls: {
      [key: string]: AbstractControl;
    } = this.userDetailForm.controls;
    const cControlKeys = Object.keys(currControls);

    const result: any = {};

    cControlKeys.forEach(
      el => {
        if (currControls[el].touched && currControls[el].valid && currControls[el].value !== '' && currControls[el].value !== null) {
          result[el] = currControls[el].value;
        }
        if (currControls[el].value === '') {
          currControls[el].reset();
        }
      }
    );
    this.authenticationService.updateAccount(result, this.presentAlert.bind(this));
  }

  async presentAlert(err: HttpErrorResponse) {
    const alert = await this.alertController.create({
      header: 'Updating had an error',
      message: err.error.message,
      buttons: ['OK']
    });
    this.setUpForm();
    await alert.present();
  }
}
