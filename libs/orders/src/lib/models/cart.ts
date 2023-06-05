export class Cart {
  items?: CartItem[];
}

export class CartItem {
  productId?: string;
  quantity?: number;
  size?: string;
}

export class CartItemDetailed {
  product?: any;
  quantity?: number;
  size?: string;
}
