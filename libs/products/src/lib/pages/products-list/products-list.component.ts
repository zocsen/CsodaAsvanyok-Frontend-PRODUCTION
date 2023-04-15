import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  private ngUnsubscribe = new Subject<void>();
  
  constructor(
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this._getProducts();
  }
  
  private _getProducts() {
    this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(products => {
      this.products = products;
    });
  }
  
  updateFilteredProducts(filteredProducts: Product[]): void {
    this.products = filteredProducts;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
