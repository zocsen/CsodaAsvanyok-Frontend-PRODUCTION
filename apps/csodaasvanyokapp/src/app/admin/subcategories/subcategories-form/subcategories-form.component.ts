import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubcategoriesService, Subcategory} from '@csodaasvanyok-frontend-production/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-subcategories-form',
  templateUrl: './subcategories-form.component.html',
  styles: [
  ]
})
export class SubcategoriesFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentSubcategoryId!: string;
    
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    
    const subcategory = {
      id: this.currentSubcategoryId,
      name: this.subcategoryForm['name'].value,
      description: this.subcategoryForm['description'].value
    }

    if (this.editMode) {
      this.updateSubcategory(subcategory);
    } else { 
      this.addSubcategory(subcategory);
    }
  }

  private updateSubcategory(subcategory: Subcategory) { 
    this.subcategoriesService.updateSubcategory(subcategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A(z) ${subcategory.name} alkategória sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'Az alkategóriát nem sikerült szerkeszteni!' })
    });
  }

  private addSubcategory(subcategory: Subcategory) { 
    this.subcategoriesService.createSubcategory(subcategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A(z) ${subcategory.name} alkategória sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'Az alkategóriát nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() { 
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentSubcategoryId = params.id;
        this.subcategoriesService.getSubcategory(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(subcategory => {
          this.subcategoryForm['name'].setValue(subcategory.name);
          this.subcategoryForm['description'].setValue(subcategory.description);
        } )
      }
    })
  }
  get subcategoryForm() {
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
