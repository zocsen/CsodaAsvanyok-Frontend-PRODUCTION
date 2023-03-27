import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@csodaasvanyok-frontend-production/orders';
import { ProductsService } from '@csodaasvanyok-frontend-production/products';
import { UsersService } from '@csodaasvanyok-frontend-production/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: number[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe((values) => {
      this.statistics = values;
    });
  }

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
