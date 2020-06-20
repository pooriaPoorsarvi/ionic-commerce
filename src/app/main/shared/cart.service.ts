import { SavingService } from './saving.service';
import { Subject, Observable } from 'rxjs';
import { ProductInterface, ProductService } from './../discover/product/product.service';
import { Injectable } from '@angular/core';


export interface CartProduct {
    product: ProductInterface;
    numberOfProduct: number;
}



@Injectable({providedIn: 'root'})
export class CartService {
    private products: CartProduct[] = [];

    private productsSubject: Subject<CartProduct[]> =  new Subject();

    private readonly key  = 'cartProducts';

    constructor(
        private savingService: SavingService
    ) {
        this.productsSubject.next(this.products.slice());

        this.savingService.retrieveObject(this.key).then(
            (result) => {
                if (typeof result !== 'undefined' && result != null) {
                    this.products = JSON.parse(result);
                }
            }
        );

        this.productsSubject.subscribe(
            (products: CartProduct[]) => {
                this.savingService.saveObject(this.key, JSON.stringify(products));
            }
        );
    }


    getCurrentInstance(): CartProduct[] {
        return this.products.slice();
    }


    private findProductIndex(product: ProductInterface): number {
        for (let i = 0 ; i < this.products.length ; i++) {
            if (this.products[i].product.id === product.id) {
                return i;
            }
        }
        return -1;
    }

    addProduct(product: ProductInterface): void {
        const index = this.findProductIndex(product);
        if (index === -1) {
            this.products.push({product, numberOfProduct: 1});
            this.productsSubject.next(this.products.slice());
        } else {
            this.products[index].numberOfProduct += 1;
        }
        this.productsSubject.next(this.products.slice());
    }


    removeProduct(product: ProductInterface): void {
        const index = this.findProductIndex(product);
        if (index === -1) {
            throw new Error('Product not found in the shopping cart');
        } else {
            this.products[index].numberOfProduct -= 1;
            if (this.products[index].numberOfProduct <= 0) {
                this.products.splice(index, 1);
            }
            this.productsSubject.next(this.products.slice());
        }
    }


    listenToProducts(): Observable<CartProduct[]> {
        return this.productsSubject.asObservable();
    }

    checkProductExistense(product: ProductInterface): boolean {
        return this.findProductIndex(product) !== -1;
    }

    getNumberOfProducts(product: ProductInterface): number {
        const index = this.findProductIndex(product);
        if (index > -1){
            return this.products[index].numberOfProduct;
        }
        return 0;
    }


}
