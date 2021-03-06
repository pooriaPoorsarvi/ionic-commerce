import { AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RequestSenderService } from '../shared/request-sender.service';
import { SavingService } from '../shared/saving.service';
import { Subject, Observable } from 'rxjs';
import { ProductInterface, ProductService } from '../discover/product/product.service';
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
        private savingService: SavingService,
        private requestSenderService: RequestSenderService,
        private httpClient: HttpClient,
        private alertController: AlertController
    ) {
        this.productsSubject.next(this.products.slice());

        this.savingService.retrieveObject(this.key).then(
            (result) => {
                if (typeof result !== 'undefined' && result !== null) {
                    this.products = JSON.parse(result);
                    this.productsSubject.next(this.products.slice());
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
        if (index > -1) {
            return this.products[index].numberOfProduct;
        }
        return 0;
    }

    async order() {
        if (this.products.length === 0) {
            throw new Error('The product size is not enough to make an order');
        }
        this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/orders', this.products);
            },
            (res) => {

                this.products = [];
                this.productsSubject.next(this.products.slice());

            },
            (err) => {
                console.log('Ordering failed.');
                console.log(err);
                const alert = this.alertController.create({
                header: 'Order Error',
                message: 'Sorry there was an error, please contact us at your earliest convinience',
                buttons: ['OK']
                }).then(
                    (res) => res.present()
                );
            },
            500,
            'Sending your order!',
            CartService.name + this.order.name,
            true,
            0
        );
    }

}
