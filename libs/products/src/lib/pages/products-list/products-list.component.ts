import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  private ngUnsubscribe = new Subject<void>();
  totalCount = 0;
  filteredCount = 0;
  pageTitle = '';
  
  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      const filter = params['filter'];
      this._getProducts(filter);
    });
  }
  
  private _getProducts(filter: string) {
  this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe((products) => {
    let filteredProducts = products.filter((product) => product.category?.name === 'Karkötő');
    
    if (filter === 'noi-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Női'));
    }
    else if (filter === 'ferfi-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Férfi'));
    }
    else if (filter === 'paros-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Páros'));
    }
    
    this.products = filteredProducts;
    this.totalCount = filteredProducts.length;
    this.filteredCount = this.products.length;
    this.updatePageTitle(filter);
  });
}
  
  updatePageTitle(filter: string): void {
    if (filter === 'osszes-karkoto') {
      this.pageTitle = 'Összes karkötő';
    }
    else if (filter === 'noi-karkotok') {
      this.pageTitle = 'Női karkötők';
    }
    else if (filter === 'ferfi-karkotok') {
      this.pageTitle = 'Férfi karkötők'; 
    }
    else if (filter === 'paros-karkotok') {
      this.pageTitle = 'Páros karkötők';
    }
  }
  
  updateFilteredProducts(filteredProducts: Product[]): void {
    this.products = filteredProducts.filter(product => product.category?.name === 'Karkötő');
    this.filteredCount = this.products.length;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
