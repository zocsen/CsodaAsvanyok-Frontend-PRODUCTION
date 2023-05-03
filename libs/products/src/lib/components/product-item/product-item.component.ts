import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  onProductClick() {
    this.productClick.emit(this.product);
  }

  onImageLoad(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.classList.remove('blur-image');
  }

  convertNameToUrl(name: string | undefined): string {
  if (!name) {
    return '';
  }
  return name.replace(/\s+/g, '-');
}


}
