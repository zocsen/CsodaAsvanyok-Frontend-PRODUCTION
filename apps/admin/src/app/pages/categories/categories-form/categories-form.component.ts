import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category} from '@csodaasvanyok-frontend-production/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId!: string;
    
  constructor(private messageService: MessageService,private formBuilder: FormBuilder, private categoriesService: CategoriesService, private location: Location, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    
    const category = {
      id: this.currentCategoryId,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value
    }

    if (this.editMode) {
      this.updateCategory(category);
    } else { 
      this.addCategory(category);
    }
  }

  private updateCategory(category: Category) { 
    this.categoriesService.updateCategory(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${category.name} kategória sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A kategóriát nem sikerült szerkeszteni!' })
    });
  }

  private addCategory(category: Category) { 
    this.categoriesService.createCategory(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${category.name} kategória sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A kategóriát nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() { 
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(category => {
          this.categoryForm['name'].setValue(category.name);
          this.categoryForm['icon'].setValue(category.icon);
        } )
      }
    })
  }
  get categoryForm() {
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
