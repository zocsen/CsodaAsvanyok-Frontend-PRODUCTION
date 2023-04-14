import { Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { Subject, takeUntil } from 'rxjs';
import { Color } from '../../models/color';

@Component({
  selector: 'products-sorter',
  templateUrl: './products-sorter.component.html',
  styles: [
  ]
})
export class ProductsSorterComponent implements OnInit, OnDestroy{

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFilterUpdate: EventEmitter<Product[]> = new EventEmitter();

  products: Product[] = [];
  private ngUnsubscribe = new Subject<void>();

  minPrice = 990;
  maxPrice= 19990;
  rangeValues: number[] = [this.minPrice, this.maxPrice];

  colors: Color[] = [
  { code: '#FF0000' }, // Red
  { code: '#FFA500' }, // Orange
  { code: '#FFFF00' }, // Yellow
  { code: '#008000' }, // Green
  { code: '#0000FF' }, // Blue
  { code: '#800080' }, // Purple
  { code: '#FFC0CB' }, // Pink
  { code: '#A52A2A' }, // Brown
  { code: '#808080' }, // Gray
  { code: '#000000' }, // Black
  { code: '#FFFFFF' }, // White
  { code: '#F5F5DC' }, // Beige
];

  selectedColors: Set<Color> = new Set();

  filteredProducts = [...this.products];

  constructor(
    private productsService: ProductsService
  ) {}

  onPriceChange() {
    this.minPrice = this.rangeValues[0];
    this.maxPrice = this.rangeValues[1];
    // Perform any additional actions when the price range changes
  }

  ngOnInit(): void {
    this._getProducts();
    const acc: HTMLCollectionOf<Element> = document.getElementsByClassName("filter-accordion");
    let i: number;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function (this: HTMLElement) {
        this.classList.toggle("active");
        const panel: HTMLElement | null = this.nextElementSibling as HTMLElement;
        if (panel && panel.style.maxHeight) {
          panel.style.maxHeight = ""
        } else if (panel) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  private _getProducts() {
      this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(products => {
        this.products = products;
      });
    }
  
    onColorSelect(color: Color): void {
      if (this.selectedColors.has(color)) {
        this.selectedColors.delete(color);
      } else {
        this.selectedColors.add(color);
      }

      if (this.selectedColors.size === 0) {
        this.filteredProducts = [...this.products];
      } else {
        this.filteredProducts = this.products.filter(product =>
          product.color?.some(c => [...this.selectedColors].map(selectedColor => selectedColor.code).includes(c.code))
        );
      }

      this.onFilterUpdate.emit(this.filteredProducts);
    }
  
  

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
