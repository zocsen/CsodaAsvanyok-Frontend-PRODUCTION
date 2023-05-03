import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';


@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit {

  products: Product[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  quantity = 1;
  isInputDisabled = true; 

  constructor(
    private productsService: ProductsService,
  ) { }

  onImageLoad(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.classList.remove('blur-image');
  }

  ngOnInit(): void {
    this.product = this.productsService.getSelectedProduct();
    console.log('Received product:', this.product);
  }

  increment(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (this.quantity > 10) {
      this.quantity = 10;
    } else if (this.quantity < 1) {
      this.quantity = 1;
    }
  }
  
}