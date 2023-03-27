import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@csodaasvanyok-frontend-production/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { OrderStatuses, ORDER_STATUS } from '../order.constants';


@Component({
  selector: 'csodaasvanyokapp-orders-list',
  templateUrl: './orders-list.component.html',
  styles: []
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  orders: Order[] = [];
  orderStatus: OrderStatuses = ORDER_STATUS;
  constructor(
    private ordersService: OrdersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  _getOrders() {
    this.ordersService.getOrders().pipe(takeUntil(this.ngUnsubscribe)).subscribe((orders) => {
      this.orders = orders;
    });
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`admin/orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Szeretnéd törölni a rendelést?',
      header: 'Rendelés törlése',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersService.deleteOrder(orderId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
          next: () => {
            this._getOrders();
            this.messageService.add({ severity: 'success', summary: 'Siker!', detail: 'A rendelés sikeresen törölve!' });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A rendelés törlése nem sikerült!' }),
        });
      },
      
    });
  }
  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
