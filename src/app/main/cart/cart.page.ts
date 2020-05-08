import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  items = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
