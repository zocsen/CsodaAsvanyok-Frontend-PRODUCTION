import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CartItem, CartItemDetailed, CartService, OrdersService } from '@csodaasvanyok-frontend-production/orders';
import { Product, ProductsService} from '@csodaasvanyok-frontend-production/products';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';



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
  moneyLeft = 15000;
  productsPriceSum = 0;
  quantity = 1;
  isInputDisabled = true;
  cartItemsDetailed: CartItemDetailed[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(
    private renderer: Renderer2,
    private cartService: CartService,
    private productsService: ProductsService,
    private router: Router,
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
    this._getCartDetails();
    this.setVH();
  }

   @HostListener('window:resize', ['$event'])
  onResize() {
    this.setVH();
  }

  setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  closeCartPanel() {
    this.cartService.closeMenu();
  }

  increment(item: CartItemDetailed): void {
    if (item.quantity < 10) {
      item.quantity++;
    }
  }

  decrement(item: CartItemDetailed): void {
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

  ngOnDestroy() {
    this.endSubs$.next(void 0);
    this.endSubs$.complete();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items.length ?? 0;
      respCart.items.forEach((cartItem) => {
        this.productsService.getProduct(cartItem.productId).subscribe((respProduct) => {
          this.cartItemsDetailed.push({
            product: respProduct,
            quantity: cartItem.quantity
          });
        });
      });
    });
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  updateCartItemQuantity(event, cartItem: CartItemDetailed) {
    this.cartService.setCartItem(
      {
        productId: cartItem.product.id,
        quantity: event.value
      },
      true
    );
  }
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}