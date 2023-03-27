import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MineralsService, Mineral } from '@csodaasvanyok-frontend-production/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-minerals-list',
  templateUrl: './minerals-list.component.html',
  styles: [
  ]
})
export class MineralsListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  minerals: Mineral[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private mineralsService: MineralsService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getMinerals();
  }

  deleteMineral(mineralId: string) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a kategóriát?',
      header: 'Megerősítés szükséges',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mineralsService.deleteMineral(mineralId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
          next: () => {
            this._getMinerals();
            this.messageService.add({ severity: 'success', summary: 'Siker!', detail: 'Az ásvány sikeresen törölve!' });
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'Az ásvány törlése nem sikerült!' }),
        });
      },
    });
  }

  updateMineral(mineralId: string) {
    this.router.navigateByUrl(`admin/minerals/form/${mineralId}`);
  }

  private _getMinerals() {
    this.mineralsService.getMinerals().pipe(takeUntil(this.ngUnsubscribe)).subscribe(cats => {
      this.minerals = cats;
    })
  }

  ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
