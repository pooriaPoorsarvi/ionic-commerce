import { CartService, CartProduct } from './../shared/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  products: CartProduct[] = [];

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.products = this.cartService.getCurrentInstance();
    this.cartService.listenToProducts().subscribe(
      (products: CartProduct[]) => {
        this.products = products;
      }
    );
  }

}
