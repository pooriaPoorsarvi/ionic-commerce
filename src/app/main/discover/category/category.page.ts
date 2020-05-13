import { NavController } from '@ionic/angular';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductInterface } from './../product/product.service';
import { CategoryInterface, CategoryService } from './category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  productItems: ProductInterface[];
  currId = '';
  items = [1, 2, 3, 4, 5];

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private navController: NavController
  ) { }

  ngOnInit() {
    // TODO remove the repeated pattern of listening to param map and moving using nav controller
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        if (params.has('pID')) {
          if (this.currId !== params.get('pID')){
            // TODO add this check for everything so tabs won't be reloaded when they don't have to be
            this.currId = params.get('pID');
            this.getProducts(this.currId);
          }
        } else {
          this.navController.navigateBack('/');
        }
      }
    );
  }

  getProducts(ID: string){
    this.categoryService.getAllProductsForCategory(ID).subscribe(
      res => this.productItems = res
    );
  }

}
