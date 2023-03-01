import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@zocsen-repo/orders';
import { ProductsService } from '@zocsen-repo/products';
import { UsersService } from '@zocsen-repo/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
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
