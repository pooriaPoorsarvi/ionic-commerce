import { AuthenticationService } from './../../shared/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class AuthenticatedComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {}

  logout() {
    this.authenticationService.logout();
  }

}
