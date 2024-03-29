/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { Subject, takeUntil } from 'rxjs';
import { Color } from '../../models/color';
import { MineralsService } from '../../services/minerals.service';
import { Mineral } from '../../models/mineral';
import { Benefit } from '../../models/benefit';
import { BenefitsService } from '../../services/benefits.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'products-sorter',
  templateUrl: './products-sorter.component.html',
  styles: [
  ]
})
export class ProductsSorterComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private productsService: ProductsService,
    private mineralsService: MineralsService,
    private benefitsService: BenefitsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFilterUpdate: EventEmitter<Product[]> = new EventEmitter();
  private ngUnsubscribe = new Subject<void>();

  products: Product[] = [];
  minerals: Mineral[] = [];
  benefits: Benefit[] = [];
  selectedMinerals: Set<Mineral> = new Set();
  selectedBenefits: Set<Benefit> = new Set();
  selectedColors: Set<Color> = new Set();
  filteredProducts = [...this.products];
  minPrice = 0;
  maxPrice = 19990;
  rangeValues: number[] = [this.minPrice, this.maxPrice];
  totalCount = 0;
  filteredCount = 0;
  mineralCheckboxStates: { [id: string]: boolean } = {};
  benefitCheckboxStates: { [id: string]: boolean } = {}; 

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

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd),takeUntil(this.ngUnsubscribe)).subscribe(() => {
       this.resetFilters();
    });

    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      const filter = params['filter'];
      this._getProducts(filter);
    });

    this._getMinerals();
    this._getBenefits();

    this.minerals.forEach(mineral => this.mineralCheckboxStates[mineral.id!] = false);
  this.benefits.forEach(benefit => this.benefitCheckboxStates[benefit.id!] = false);
  }

  ngAfterViewInit() {
    this.setupAccordion();
  }

  setupAccordion() {
    const accordionBtns = document.querySelectorAll('.filter-accordion');
    accordionBtns.forEach((accordionBtn) => {
      accordionBtn.addEventListener('click', () => {
        const panel = accordionBtn.nextElementSibling as HTMLElement;
        panel.classList.toggle('hide-panel');
      });
    });
  }

  isSelected(color: Color): boolean {
    return this.selectedColors.has(color);
  }

  private _getProducts(filter: string) {
    this.productsService.getProducts().pipe(takeUntil(this.ngUnsubscribe)).subscribe(products => {
      let filteredProducts = products.filter((product) => product.category?.name === 'Karkötő');
    
    if (filter === 'noi-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Női'));
    }
    else if (filter === 'ferfi-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Férfi'));
    }
    else if (filter === 'paros-karkotok') {
      filteredProducts = filteredProducts.filter((product) => product.subcategory?.some((subcategory) => subcategory.name === 'Páros'));
    }
    
    this.products = filteredProducts;
    this.totalCount = filteredProducts.length;
    this.filteredCount = this.products.length;
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
    this.mineralCheckboxStates[mineral.id!] = false;
  } else {
    this.selectedMinerals.add(mineral);
    this.mineralCheckboxStates[mineral.id!] = true;
  }
  this.applyFilters();
}

onBenefitSelect(benefit: Benefit): void {
  if (this.selectedBenefits.has(benefit)) {
    this.selectedBenefits.delete(benefit);
    this.benefitCheckboxStates[benefit.id!] = false;
  } else {
    this.selectedBenefits.add(benefit);
    this.benefitCheckboxStates[benefit.id!] = true;
  }
  this.applyFilters();
}
  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  resetFilters(): void {
    this.selectedColors.clear();
    
    this.minerals.forEach(mineral => this.mineralCheckboxStates[mineral.id!] = false);
    this.benefits.forEach(benefit => this.benefitCheckboxStates[benefit.id!] = false);


    // Reset the range values
    this.minPrice = 0;
    this.maxPrice = 19990;
    this.rangeValues = [this.minPrice, this.maxPrice];

    this.applyFilters();
  }
}
