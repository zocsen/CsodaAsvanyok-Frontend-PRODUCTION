import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _menuState = new BehaviorSubject<string>('out');
  menuState$ = this._menuState.asObservable();
  private _showOverlay = new BehaviorSubject<boolean>(false);
  showOverlay$ = this._showOverlay.asObservable();
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  toggleMenu() {
    this._menuState.next(this._menuState.value === 'out' ? 'in' : 'out');
    this._showOverlay.next(this._menuState.value === 'in');
  }

  closeMenu() {
    this._menuState.next('out');
    this._showOverlay.next(false);
  }

  openMenu() {
    this._menuState.next('in');
    this._showOverlay.next(true);
  }

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const initialCart = {
      items: []
      };
      const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem('cart', initialCartJson);
    }
  }

  getCart(): Cart {
    const cartJsonString: string = localStorage.getItem('cart');
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();
  const cartItemExist = cart.items.find((item) => item.productId === cartItem.productId && item.size === cartItem.size);
  if (cartItemExist) {
    cart.items.map((item) => {
      if (item.productId === cartItem.productId && item.size === cartItem.size) {
        if (updateCartItem) {
          item.quantity = cartItem.quantity;
        } else {
          item.quantity = item.quantity + cartItem.quantity;
        }

        return item;
      }
    });
  } else {
    cart.items.push(cartItem);
  }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem('cart', cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string, size: string) {
  const cart = this.getCart();
  const newCart = cart.items.filter((item) => item.productId !== productId || item.size !== size);

  cart.items = newCart;

  const cartJsonString = JSON.stringify(cart);
  localStorage.setItem('cart', cartJsonString);

  this.cart$.next(cart);
}

}
