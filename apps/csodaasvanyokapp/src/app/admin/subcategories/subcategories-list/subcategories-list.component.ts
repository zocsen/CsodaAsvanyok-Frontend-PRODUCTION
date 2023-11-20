import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SubcategoriesService,
  Subcategory,
} from '@csodaasvanyok-frontend-production/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-subcategories-list',
  templateUrl: './subcategories-list.component.html',
  styles: [],
})
export class SubcategoriesListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  subcategories: Subcategory[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private subcategoriesService: SubcategoriesService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getSubcategories();
  }

  deleteSubcategory(subcategoryId: string) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a kategóriát?',
      header: 'Megerősítés szükséges',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.subcategoriesService
          .deleteSubcategory(subcategoryId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: () => {
              this._getSubcategories();
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: 'Az ásvány sikeresen törölve!',
              });
            },
            error: () =>
              this.messageService.add({
                severity: 'error',
                summary: 'Hiba!',
                detail: 'Az ásvány törlése nem sikerült!',
              }),
          });
      },
    });
  }

  updateSubcategory(subcategoryId: string) {
    this.router.navigateByUrl(`subcategories/form/${subcategoryId}`);
  }

  private _getSubcategories() {
    this.subcategoriesService
      .getSubcategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((cats) => {
        this.subcategories = cats;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
