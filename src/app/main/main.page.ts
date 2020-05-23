import { AuthenticationService } from './shared/authentication.service';
import { CategoryInterface, CategoryService } from './discover/category/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {


  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.getAuthenticationModel().isExpired) {
      this.authenticationService.authenticateFromServer({email: 'p@gam.c', password: 'password'});
    }
  }

}
