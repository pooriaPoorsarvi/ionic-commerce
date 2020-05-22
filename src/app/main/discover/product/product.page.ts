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

  constructor(private navCntrl: NavController, private activatedRoute: ActivatedRoute, public productService: ProductService) { }
  goBack() {
    this.navCntrl.navigateBack(['/']);
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('pID')) {
          if (this.id !== paramMap.get('pID')) {
            this.id = paramMap.get('pID');
            this.productService.getProduct(this.id).subscribe(
              (product: ProductInterface) => {
                this.product = product;
              }
            );
          }
        } else {
          this.goBack();
        }
      }
    );
  }



}
