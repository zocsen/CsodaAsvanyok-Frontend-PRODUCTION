import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@csodaasvanyok-frontend-production/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ORDER_STATUS } from '../order.constants';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: []
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  order?: Order;
  orderStatuses: { id: string, name: string }[] = [];
  selectedStatus: any;

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  private _getOrder() {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      if (params.id) {
        this.orderService.getOrder(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((order) => {
          this.order = order;
          this.selectedStatus = order.status;
        });
      }
    });
  }

  onStatusChange(event: any) {
    if (this.order?.id !== undefined) {
      this.orderService.updateOrder({ status: event.value }, this.order?.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order is updated!'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Order is not updated!'
          });
        }
      });
    }
  }
  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
