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
    { code: '#FF000D', name: 'Piros' }, // Red
    { code: '#FFA756', name: 'Narancssárga' }, // Orange
    { code: '#FFFF00', name: 'Citromsárga' }, // Yellow
    { code: '#008F00', name: 'Zöld' }, // Green
    { code: '#1371D5', name: 'Kék' }, // Blue
    { code: '#6E2FCC', name: 'Lila' }, // Purple
    { code: '#F9B7FF', name: 'Rózsaszín' }, // Pink
    { code: '#212121', name: 'Fekete' }, // Black
    { code: '#FFFFFF', name: 'Fehér' }, // White
    { code: '#8F6C4E', name: 'Barna' }, // Brown
    { code: '#A3A3A1', name: 'Szürke' }, // Gray
    { code: '#F6C61B', name: 'Arany' }, // Gold
    { code: '#F1D0CC', name: 'Rose Gold' }, // Rose Gold
    { code: '#BCC6CC', name: 'Ezüst' }, // Silver
    
  ];

  selectedColors: Set<Color> = new Set();

  filteredProducts = [...this.products];

  ngOnInit(): void {
    this._getProducts();
    this._getMinerals();
    this._getBenefits();
    
document.addEventListener('DOMContentLoaded', () => {
  const accordionBtns = document.querySelectorAll('.filter-accordion');

  accordionBtns.forEach((accordionBtn) => {
    accordionBtn.addEventListener('click', () => {
      const panel = accordionBtn.nextElementSibling as HTMLElement;
      panel.classList.toggle('hide-panel');
    });
  });
});
  }

  private _getProducts() {
    this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(products => {
      this.products = products;
    });
  }

  private _getMinerals() {
    this.mineralsService.getMinerals().pipe(takeUntil(this.ngUnsubscribe)).subscribe(minerals => {
      this.minerals = minerals;
      this.minerals = minerals.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    })
    
  }

  private _getBenefits() {
   this.benefitsService.getBenefits().pipe(takeUntil(this.ngUnsubscribe)).subscribe(benefits => {
     this.benefits = benefits;
     this.benefits = benefits.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
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
  this.applyFilters();
  }
  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
