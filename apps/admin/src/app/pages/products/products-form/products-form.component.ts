import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, MineralsService, Mineral, SubcategoriesService, Subcategory, ProductsService } from '@csodaasvanyok-frontend-production/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy{
  private ngUnsubscribe = new Subject<void>();
  
  editMode = false;
  form!: FormGroup;
  isSubmitted = false;
  categories: Category[] = [];
  minerals: Mineral[] = [];
  subcategories: Subcategory[] = [];
  imageDisplay!: string | ArrayBuffer | any;
  currentProductId!: string;
  category!: string;
  mineral!: string;
  subcategory!: string;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private categoriesService: CategoriesService,
    private mineralsService: MineralsService,
    private subcategoriesService: SubcategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._getMinerals();
    this._getSubcategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['',Validators.required],
      description: ['',Validators.required],
      price: ['',Validators.required],
      category: ['', Validators.required],
      mineral: ['', Validators.required],
      subcategory: ['', Validators.required],
      image: ['',Validators.required],
      isFeatured: [false]
    })
  }
   private _getCategories() {
   this.categoriesService.getCategories().pipe(takeUntil(this.ngUnsubscribe)).subscribe(categories => {
     this.categories = categories;
     console.log(this.categories)
  })
  }
  
  private _getMinerals() {
    this.mineralsService.getMinerals().pipe(takeUntil(this.ngUnsubscribe)).subscribe(minerals => {
      this.minerals = minerals;
      console.log(this.mineral);
    })
  }

  private _getSubcategories() {
   this.subcategoriesService.getSubcategories().pipe(takeUntil(this.ngUnsubscribe)).subscribe(subcategories => {
     this.subcategories = subcategories;
     console.log(this.subcategories)
  })
  }

  
  
  private _updateProduct(productFormData: FormData) { 
    this.productService.updateProduct(productFormData, this.currentProductId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A termék sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A terméket nem sikerült szerkeszteni!' })
    });
  }
  
  private _addProduct(productData: FormData) { 
    this.productService.createProduct(productData).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A termék sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A terméket nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      if (params.id) {
        this.editMode = true;
        this.currentProductId = params.id;

        this.productService.getProduct(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.category.setValue(product?.category?.id);
          this.productForm.mineral.setValue(product.mineral?.map(mineral => mineral.id));
          this.productForm.subcategory.setValue(product.subcategory?.map(subcategory => subcategory.id));
          this.productForm.price.setValue(product.price);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        });
      }
    });
  }

  onSubmit() { 
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });

    if (this.editMode) {
      this._updateProduct(productFormData);
    } else { 
      this._addProduct(productFormData);
    }
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    
    if (file) {
      this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imageDisplay = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  get productForm() {
    return this.form.controls;
  }

  backClicked() {
    this.location.back();
  }

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
  
}

