import { ProductInterface } from './../product/product.service';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subscription, Subject, Observable } from 'rxjs';



@Injectable({providedIn: 'root'})
export class SearchService {


    private searchedProducts: ProductInterface[] = [];

    private searchedProductsSubject: Subject<ProductInterface[]> = new Subject<ProductInterface[]>();


    currentSubcsription: Subscription;

    constructor(private httpClient: HttpClient) {}

    searchForProduct(textToSearch: string): void {
        if (this.currentSubcsription !== null && typeof this.currentSubcsription !== 'undefined') {
            this.currentSubcsription.unsubscribe();
        }
        this.currentSubcsription = this.httpClient.post(environment.apiUrl + '/products/search', textToSearch).subscribe(
            (products: ProductInterface[]) => this.setUpSearchResult(products)
        );
    }


    setUpSearchResult(products: ProductInterface[]): void {
        this.searchedProducts = products;
        this.searchedProductsSubject.next(this.searchedProducts.slice());
    }

    getCurrentSearchedProducts(): ProductInterface[] {
        return this.searchedProducts.slice();
    }

    getSearchedProductsStream(): Observable<ProductInterface[]> {
        return this.searchedProductsSubject.asObservable();
    }

}



