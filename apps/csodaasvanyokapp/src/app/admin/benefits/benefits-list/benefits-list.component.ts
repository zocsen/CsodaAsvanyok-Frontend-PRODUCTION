import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Benefit,
  BenefitsService,
} from '@csodaasvanyok-frontend-production/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-benefits-list',
  templateUrl: './benefits-list.component.html',
  styles: [],
})
export class BenefitsListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  benefits: Benefit[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private benefitsService: BenefitsService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getBenefits();
  }

  deleteBenefit(benefitId: string) {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a hatást?',
      header: 'Megerősítés szükséges',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.benefitsService
          .deleteBenefit(benefitId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: () => {
              this._getBenefits();
              this.messageService.add({
                severity: 'success',
                summary: 'Siker!',
                detail: 'A hatás sikeresen törölve!',
              });
            },
            error: () =>
              this.messageService.add({
                severity: 'error',
                summary: 'Hiba!',
                detail: 'A hatás törlése nem sikerült!',
              }),
          });
      },
    });
  }

  updateBenefit(benefitId: string) {
    this.router.navigateByUrl(`benefits/form/${benefitId}`);
  }

  private _getBenefits() {
    this.benefitsService
      .getBenefits()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((cats) => {
        this.benefits = cats;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
