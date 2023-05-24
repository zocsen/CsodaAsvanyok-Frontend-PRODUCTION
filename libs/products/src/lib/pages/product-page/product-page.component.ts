import { Component, HostListener, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { CartItem, CartService } from '@csodaasvanyok-frontend-production/orders';
import { MessageService } from 'primeng/api';


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
  screenWidth = window.innerWidth;
  calcRightSide: string | undefined;
  

  @HostListener('window:resize', ['$event'])
    onResize() {
    this.screenWidth = window.innerWidth;
    this.calcRightSide = ((this.screenWidth / 2) - 700).toString() + "px";
    console.log(this.calcRightSide);
    }

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private messageService: MessageService,
  ) {
    this.onResize();
   }

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

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
    }

    this.cartService.setCartItem(cartItem);
    this.showSuccess();
  }

  showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: 'A termék sikeresen a kosárhoz lett adva' });
    }
  
  
}