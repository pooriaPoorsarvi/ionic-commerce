import { CartService } from './../../shared/cart.service';
import { ProductService } from './product.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {ProductInterface} from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  id: string;
  product: ProductInterface;

  numberOfProductsInCart = 0;

  constructor(
    private navCntrl: NavController,
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public cartService: CartService
  ) { }
  goBack() {
    this.navCntrl.navigateBack(['/']);
  }

  // TODO make sure everything happens after you get the product so you don't get an error for unidentified version
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('pID')) {
          if (this.id !== paramMap.get('pID')) {
            this.id = paramMap.get('pID');
            this.productService.getProduct(this.id).subscribe(
              (product: ProductInterface) => {
                this.product = product;
                this.checkNumberOfProductsInCart();
              }
            );
          }
        } else {
          this.goBack();
        }
      }
    );
  }


  checkNumberOfProductsInCart() {
    this.numberOfProductsInCart = this.cartService.getNumberOfProducts(this.product);
    this.cartService.listenToProducts().subscribe ( _ => this.numberOfProductsInCart = this.cartService.getNumberOfProducts(this.product) );
  }

  addToShoppingCart(): void {
    this.cartService.addProduct(this.product);
  }

  decreaseProductNumber(): void {
    this.cartService.removeProduct(this.product);
  }



}
