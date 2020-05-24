import { AuthenticationService } from './../../../shared/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
export class AccountDetailComponent implements OnInit {

// TODO make sure if password is empty you don't send it to the server
  userDetailForm  = new FormGroup({
    firstName: new FormControl('Pooria', [Validators.required]),
    lastName: new FormControl('Poorsarvi Tehrani', [Validators.required]),
    email: new FormControl(this.authenticationService.getAuthenticationModel().getEmail(), [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {}

  logout() {
    console.log(this.authenticationService.getAuthenticationModel().getEmail());
    this.authenticationService.logout();
  }

}
