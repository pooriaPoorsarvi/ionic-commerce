import { AuthenticationService } from './../shared/authentication.service';
import { CartService, CartProduct } from './cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  products: CartProduct[] = [];

  price = 0;

  constructor(
    private cartService: CartService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.products = this.cartService.getCurrentInstance();
    this.cartService.listenToProducts().subscribe(
      (products: CartProduct[]) => {
        this.products = products;
        this.updatePrice();
      }
    );
  }

  updatePrice(): void {
    let sum = 0;
    for (const product of this.products) {
      sum += product.product.price * product.numberOfProduct;
    }
    this.price = sum;
  }

  addProduct(product: CartProduct) {
    this.cartService.addProduct(product.product);
  }

  removeProduct(product: CartProduct) {
    this.cartService.removeProduct(product.product);
  }

  order() {
    this.cartService.order();
  }


  authenticated(): boolean {
    return ! this.authenticationService.getAuthenticationModel().isExpired();
  }

}

