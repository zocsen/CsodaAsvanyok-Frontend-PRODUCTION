import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { Subject, takeUntil } from 'rxjs';
import { Color } from '../../models/color';
import { MineralsService } from '../../services/minerals.service';
import { Mineral } from '../../models/mineral';
import { Benefit } from '../../models/benefit';
import { BenefitsService } from '../../services/benefits.service';

@Component({
  selector: 'products-sorter',
  templateUrl: './products-sorter.component.html',
  styles: [
  ]
})
export class ProductsSorterComponent implements OnInit, OnDestroy {
  constructor(
    private productsService: ProductsService,
    private mineralsService: MineralsService,
    private benefitsService: BenefitsService,
  ) {}

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFilterUpdate: EventEmitter<Product[]> = new EventEmitter();
  private ngUnsubscribe = new Subject<void>();

  products: Product[] = [];
  minerals: Mineral[] = [];
  benefits: Benefit[] = [];
  selectedMinerals: Set<Mineral> = new Set();
  selectedBenefits: Set<Benefit> = new Set();
  minPrice = 0;
  maxPrice = 19990;
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

  ngOnInit(): void {
    this._getProducts();
    this._getMinerals();
    this._getBenefits();
    const acc: HTMLCollectionOf<Element> = document.getElementsByClassName("filter-accordion");
    let i: number;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function (this: HTMLElement) {
        this.classList.toggle("active");
        const panel: HTMLElement | null = this.nextElementSibling as HTMLElement;
        if (panel && panel.style.maxHeight) {
          panel.style.maxHeight = "";
        } else if (panel) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }

  private _getProducts() {
    this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(products => {
      this.products = products;
      console.log(products)
    });
  }

  private _getMinerals() {
    this.mineralsService.getMinerals().pipe(takeUntil(this.ngUnsubscribe)).subscribe(minerals => {
      this.minerals = minerals;
      //this.minerals = minerals.sort((a, b) => a.name.localeCompare(b.name));
    })
    
  }

  private _getBenefits() {
   this.benefitsService.getBenefits().pipe(takeUntil(this.ngUnsubscribe)).subscribe(benefits => {
     this.benefits = benefits;
     //this.benefits = benefits.sort((a, b) => a.name.localeCompare(b.name));
     console.log(benefits)
  })
  }

 applyFilters(): void {
  this.filteredProducts = this.products.filter(product => {
    const priceInRange =
      (product.price ?? 10000) >= this.minPrice && (product.price ?? 10000) <= this.maxPrice;

    const colorMatch =
      this.selectedColors.size === 0 ||
      (product.color &&
        product.color.some(c =>
          [...this.selectedColors].map(selectedColor => selectedColor.code).includes(c.code)
        ));

    const mineralMatch =
      this.selectedMinerals.size === 0 ||
      (product.mineral &&
        product.mineral.some(mineral =>
          [...this.selectedMinerals].map(selectedMineral => selectedMineral.id).includes(mineral.id)
        ));

    const benefitMatch =
  this.selectedBenefits.size === 0 ||
  (product.mineral &&
    product.mineral.some(mineral =>
      mineral.benefit && mineral.benefit.some(benefitId =>
        [...this.selectedBenefits].map(selectedBenefit => selectedBenefit.id).includes(benefitId as string)
      )
    ));

    console.log('Benefit Match:', benefitMatch);

    return priceInRange && colorMatch && mineralMatch && benefitMatch;
  });

  this.onFilterUpdate.emit(this.filteredProducts);
}


  onPriceChange(): void {
    this.minPrice = this.rangeValues[0];
    this.maxPrice = this.rangeValues[1];
    this.applyFilters();
  }

  onColorSelect(color: Color): void {
    if (this.selectedColors.has(color)) {
      this.selectedColors.delete(color);
    } else {
      this.selectedColors.add(color);
    }
    this.applyFilters();
  }

  onMineralSelect(mineral: Mineral): void {
  if (this.selectedMinerals.has(mineral)) {
    this.selectedMinerals.delete(mineral);
  } else {
    this.selectedMinerals.add(mineral);
  }
  this.applyFilters();
  }
  
  onBenefitSelect(benefit: Benefit): void {
  if (this.selectedBenefits.has(benefit)) {
    this.selectedBenefits.delete(benefit);
  } else {
    this.selectedBenefits.add(benefit);
  }
    console.log('Selected Benefits:', this.selectedBenefits);
  this.applyFilters();
  console.log('Filtered products:', this.filteredProducts);
  }
  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
