import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Benefit, BenefitsService } from '@csodaasvanyok-frontend-production/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-benefits-form',
  templateUrl: './benefits-form.component.html',
  styles: [
  ]
})
export class BenefitsFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentBenefitId!: string;
    
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private benefitsService: BenefitsService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this._checkEditMode();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    
    const benefit = {
      id: this.currentBenefitId,
      name: this.benefitForm['name'].value
    }

    if (this.editMode) {
      this.updateBenefit(benefit);
    } else { 
      this.addBenefit(benefit);
    }
  }

  private updateBenefit(benefit: Benefit) { 
    this.benefitsService.updateBenefit(benefit).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${benefit.name} hatás sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A hatást nem sikerült szerkeszteni!' })
    });
  }

  private addBenefit(benefit: Benefit) { 
    this.benefitsService.createBenefit(benefit).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${benefit.name} hatás sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A hatást nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() { 
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.currentBenefitId = params['id'];
        this.benefitsService.getBenefit(params['id']).pipe(takeUntil(this.ngUnsubscribe)).subscribe(benefit => {
          this.benefitForm['name'].setValue(benefit.name);
        } )
      }
    })
  }
  get benefitForm() {
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
