import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { environment } from '@env/environment';
import { Subject } from 'rxjs/internal/Subject';
import { CartItemDetailed } from '../../models/cart';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { map } from 'rxjs/internal/operators/map';
import { ProductsService } from '@csodaasvanyok-frontend-production/products';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { loadStripe } from '@stripe/stripe-js';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ORDER_STATUS } from '../../order.constants';
import { Order } from '../../models/order';
import { OrdersService } from '../../services/orders.service';
import { OrderItem } from '../../models/order-item';

@Component({
  selector: 'orders-shipping-info',
  templateUrl: './shipping-info.component.html',
  styles: [],
  animations: [
    trigger('slideInOutShippingDetails', [
      state('shippingIn', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('shippingOut', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('shippingIn => shippingOut', animate('400ms ease-in-out')),
      transition('shippingOut => shippingIn', animate('400ms ease-in-out'))
    ]),
  ]
})
export class ShippingInfoComponent implements OnInit {

  apiURLOrders = environment.apiURL;
  shippingPanelState: string | undefined;
  shippingPanelShowOverlay: boolean | undefined;
  productsPriceSum = 0;
  cartItemsDetailed: CartItemDetailed[] = [];
  endSubs$: Subject<any> = new Subject();
  stripe: any;
  isSubmitted = false;

  phoneNumber?: string
  checkoutFormGroup?: FormGroup;
  
  constructor(
    private renderer: Renderer2,
    private cartService: CartService,
    private http: HttpClient,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    @Inject(DOCUMENT) private document: Document
  ) {
      this.loadStripe();
      this.cartService.shippingPanelState$.subscribe(shippingState => {
        this.shippingPanelState = shippingState;
        if (shippingState === 'shippingOut') {
          this.renderer.removeClass(this.document.body, 'no-scroll');
        }
      });

      this.cartService.shippingPanelShowOverlay$.subscribe(showShippingOverlay => {
        this.shippingPanelShowOverlay = showShippingOverlay;
      });
   }

  
  ngOnInit(): void {
    this._getCartDetails();
    this._initCheckoutForm();
  }

  private _initCheckoutForm() {
  this.checkoutFormGroup = this.formBuilder.group({
    surname: [''],
    forename: [''],
    zipCode: [''],
    city: [''],
    country: [''],
    address: [''],
    phone: ['']
  });
}

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
      this.cartItemsDetailed = [];
      
      const productObservables = respCart.items.map((cartItem) => 
        this.productsService.getProduct(cartItem.productId).pipe(
          map(product => ({
            product,
            quantity: cartItem.quantity,
            size: cartItem.size
          }))
        )
      );

      forkJoin(productObservables).subscribe((results) => {
        this.cartItemsDetailed = results;
        this._calculateCartTotal();
      });
    });
  }
  
  private _calculateCartTotal() {
    this.productsPriceSum = this.cartItemsDetailed.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
  }
  
  closeShippingPanel() {
    this.cartService.closeShippingPanel();
  };

  async loadStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v3/";
      s.onload = async () => {
        this.stripe = await loadStripe('pk_test_51LoZByBmmuocJNA7KzQiPk3wWNOIWr0SwpPeKzoteaGMDh1cz9PvKEPr9XVQ6XeLJ49av69OQSBDCZRYpPUqELjc00UCWD2Ejk');
      }
      window.document.body.appendChild(s);
    }
  }

  checkout() {
  if (this.checkoutFormGroup.invalid) {
    alert('Please fill out the form before proceeding');
    return;
  }

  const order = new Order();  // Create a new order
  order.orderItems = this.cartItemsDetailed.map((item: CartItemDetailed) => {
    const orderItem = new OrderItem(); // Create new order item
    orderItem.product = item.product;
    orderItem.quantity = item.quantity;
    orderItem.size = item.size;
    return orderItem;
  });

  // order.user = /* You should set the user ID or object depending on your setup */ ;
  order.status = 0;
  order.totalPrice = this.productsPriceSum.toString();
  order.shippingAddress1 = this.checkoutFormGroup.value; // Set the address field to the form value

  this.ordersService.createOrder(order).subscribe((res: any) => {
    // After the order is created, create a Stripe checkout session
    this.http.post(`${this.apiURLOrders}/orders/create-checkout-session`, { items: this.cartService.getCart().items })
      .subscribe((session: { id: string }) => {
        this.stripe.redirectToCheckout({ sessionId: session.id }).then((result: any) => {
          if (result.error) {
            console.log(result.error.message);
          }
        });
      });
  }, (err: any) => {
    console.error(err);
  });
}
}
