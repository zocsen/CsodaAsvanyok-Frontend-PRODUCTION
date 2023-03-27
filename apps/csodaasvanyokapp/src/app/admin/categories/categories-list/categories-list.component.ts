import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@csodaasvanyok-frontend-production/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  categories: Category[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a kategóriát?',
      header: 'Megerősítés szükséges',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.categoriesService.deleteCategory(categoryId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
            next: () => {
              this._getCategories();
              this.messageService.add({ severity: 'success', summary: 'Siker!', detail: 'A kategória sikeresen törölve!' });
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A kategória törlése nem sikerült!' }),
          });
      },
  });
  }

  updateCategory(categoryId: string) { 
    this.router.navigateByUrl(`admin/categories/form/${categoryId}`);

  }


  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.ngUnsubscribe)).subscribe(cats => {
      this.categories = cats;
    })
  }

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}