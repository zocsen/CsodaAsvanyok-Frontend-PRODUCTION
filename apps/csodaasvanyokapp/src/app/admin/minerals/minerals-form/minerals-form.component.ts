import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MineralsService, Mineral, BenefitsService, Benefit} from '@csodaasvanyok-frontend-production/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csodaasvanyokapp-minerals-form',
  templateUrl: './minerals-form.component.html',
  styles: [
  ]
})
export class MineralsFormComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentMineralId!: string;
  benefits: Benefit[] = [];
    
  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private mineralsService: MineralsService,
    private benefitsService: BenefitsService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      benefit: ['', Validators.required],
    });

    this._checkEditMode();
    this._getBenefits();
  }

   private _getBenefits() {
   this.benefitsService.getBenefits().pipe(takeUntil(this.ngUnsubscribe)).subscribe(benefits => {
     this.benefits = benefits;

     this.benefits = benefits.sort((a, b) => a.name.localeCompare(b.name));
  })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    
    const mineral = {
      id: this.currentMineralId,
      name: this.mineralForm['name'].value,
      description: this.mineralForm['description'].value,
      benefit: this.mineralForm['benefit'].value.join(',')
    }

    if (this.editMode) {
      this.updateMineral(mineral);
    } else { 
      this.addMineral(mineral);
    }
  }

  private updateMineral(mineral: Mineral) { 
    this.mineralsService.updateMineral(mineral).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${mineral.name} ásvány sikeresen szerkesztve lett!` });
        setTimeout(() => {
          this.backClicked();
         }, 1500);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'Az ásványt nem sikerült szerkeszteni!' })
    });
  }

  private addMineral(mineral: Mineral) { 
    this.mineralsService.createMineral(mineral).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Siker!', detail: `A ${mineral.name} kategória sikeresen létrehozva!` });
        this.form.reset();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Hiba!', detail: 'A kategóriát nem sikerült létrehozni!' })
    });
  }

  private _checkEditMode() { 
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentMineralId = params.id;
        this.mineralsService.getMineral(params.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(mineral => {
          this.mineralForm['name'].setValue(mineral.name);
          this.mineralForm['description'].setValue(mineral.description);
          this.mineralForm['benefit'].setValue(mineral.benefit?.map(benefit => benefit.id));
        } )
      }
    })
  }
  get mineralForm() {
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
