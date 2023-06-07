import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxStripeModule } from 'ngx-stripe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxStripeModule.forRoot('pk_test_51LoZByBmmuocJNA7KzQiPk3wWNOIWr0SwpPeKzoteaGMDh1cz9PvKEPr9XVQ6XeLJ49av69OQSBDCZRYpPUqELjc00UCWD2Ejk'),
  ],
  declarations: [
    CartPanelComponent,
  ],
  exports: [
    CartPanelComponent,
  ],
})
export class OrdersModule {
  constructor(cartService: CartService) {
    cartService.initCartLocalStorage();
  }
}
