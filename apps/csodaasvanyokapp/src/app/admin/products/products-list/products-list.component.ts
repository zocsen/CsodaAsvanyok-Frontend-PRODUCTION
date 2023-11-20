import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Product,
  ProductsService,
} from '@csodaasvanyok-frontend-production/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private confirmationService: ConfirmationService,
    private productsService: ProductsService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts() {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((products) => {
        this.products = products;
      });
  }

  updateProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`);
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a terméket?',
      header: 'Megerősítés szükséges!',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService
          .deleteProduct(productId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: () => {
              this._getProducts();
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: 'A termék sikeresen törölve!',
              });
            },
            error: () =>
              this.messageService.add({
                severity: 'error',
                summary: 'Hiba!',
                detail: 'A termék törlése nem sikerült!',
              }),
          });
      },
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
