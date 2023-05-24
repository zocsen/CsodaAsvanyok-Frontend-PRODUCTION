import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CartItem, CartService } from '@csodaasvanyok-frontend-production/orders';
import { Product, ProductsService } from '@csodaasvanyok-frontend-production/products';
import { Observable, forkJoin, map } from 'rxjs';


@Component({
  selector: 'orders-cart-panel',
  templateUrl: './cart-panel.component.html',
  styles: [
  ],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})

export class CartPanelComponent implements OnInit {

  menuState: string | undefined;
  showOverlay: boolean | undefined;
  cartCount = 0;
  cartItems: CartItemWithProduct[] = []; 
  products: Product[] = [];
  moneyLeft = 15000;
  productsPriceSum = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  quantity = 1;
  isInputDisabled = true; 

  constructor(
    private renderer: Renderer2,
    private cartService: CartService,
    private productsService: ProductsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.cartService.menuState$.subscribe(state => {
      this.menuState = state;
      if (state === 'out') {
        this.renderer.removeClass(this.document.body, 'no-scroll');
      }
    });

    this.cartService.showOverlay$.subscribe(show => {
      this.showOverlay = show;
    });
  }

  ngOnInit(): void {
  // Retrieve cart from local storage
  const cart = this.cartService.getCart();

  if (cart && cart.items) {
    this.cartCount = cart.items.length;

    // Retrieve product details for each cart item
    const cartItemsObservables: Observable<CartItemWithProduct>[] = cart.items.map(item => {
      return this.productsService.getProduct(item.productId).pipe(
        map(product => {
          return { ...item, product }; // merge cart item with product details
        })
      );
    });

    // Wait for all product details to be retrieved, then update cartItems
    forkJoin(cartItemsObservables).subscribe(items => {
      this.cartItems = items as CartItemWithProduct[];
      console.log(this.cartItems);
    });
  }
}
  
  closeCartPanel() {
    this.cartService.closeMenu();
  }

  increment(item: CartItemWithProduct): void {
  if (item.quantity < 10) {
    item.quantity++;
  }
}

decrement(item: CartItemWithProduct): void {
  if (item.quantity > 1) {
    item.quantity--;
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
  }
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}