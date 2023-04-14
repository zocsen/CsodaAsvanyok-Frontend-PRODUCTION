import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductsSorterComponent } from './components/products-sorter/products-sorter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

export const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
  },
  {
    path: ':id',
    component: ProductPageComponent,
  },

]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    SliderModule,
  ],
  declarations: [
    ProductsListComponent,
    ProductPageComponent,
    ProductItemComponent,
    ProductsSorterComponent,
  ],
  exports: [
    RouterModule,
  ],
})
export class ProductsModule {}
