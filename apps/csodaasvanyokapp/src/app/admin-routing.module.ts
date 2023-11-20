import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shared/shell/shell.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { OrdersDetailComponent } from './admin/orders/orders-detail/orders-detail.component';
import { OrdersListComponent } from './admin/orders/orders-list/orders-list.component';
import { UsersFormComponent } from './admin/users/users-form/users-form.component';
import { UsersListComponent } from './admin/users/users-list/users-list.component';
import { ProductsFormComponent } from './admin/products/products-form/products-form.component';
import { ProductsListComponent } from './admin/products/products-list/products-list.component';
import { SubcategoriesFormComponent } from './admin/subcategories/subcategories-form/subcategories-form.component';
import { SubcategoriesListComponent } from './admin/subcategories/subcategories-list/subcategories-list.component';
import { MineralsFormComponent } from './admin/minerals/minerals-form/minerals-form.component';
import { MineralsListComponent } from './admin/minerals/minerals-list/minerals-list.component';
import { CategoriesFormComponent } from './admin/categories/categories-form/categories-form.component';
import { CategoriesListComponent } from './admin/categories/categories-list/categories-list.component';
import { AuthGuard } from '@csodaasvanyok-frontend-production/users';
import { BenefitsListComponent } from './admin/benefits/benefits-list/benefits-list.component';
import { BenefitsFormComponent } from './admin/benefits/benefits-form/benefits-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'categories',
        component: CategoriesListComponent,
      },
      {
        path: 'categories/form',
        component: CategoriesFormComponent,
      },
      {
        path: 'categories/form/:id',
        component: CategoriesFormComponent,
      },
      {
        path: 'minerals',
        component: MineralsListComponent,
      },
      {
        path: 'minerals/form',
        component: MineralsFormComponent,
      },
      {
        path: 'minerals/form/:id',
        component: MineralsFormComponent,
      },
      {
        path: 'subcategories',
        component: SubcategoriesListComponent,
      },
      {
        path: 'subcategories/form',
        component: SubcategoriesFormComponent,
      },
      {
        path: 'subcategories/form/:id',
        component: SubcategoriesFormComponent,
      },
      {
        path: 'benefits',
        component: BenefitsListComponent,
      },
      {
        path: 'benefits/form',
        component: BenefitsFormComponent,
      },
      {
        path: 'benefits/form/:id',
        component: BenefitsFormComponent,
      },
      {
        path: 'products',
        component: ProductsListComponent,
      },
      {
        path: 'products/form',
        component: ProductsFormComponent,
      },
      {
        path: 'products/form/:id',
        component: ProductsFormComponent,
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'users/form',
        component: UsersFormComponent,
      },
      {
        path: 'users/form/:id',
        component: UsersFormComponent,
      },
      {
        path: 'orders',
        component: OrdersListComponent,
      },
      {
        path: 'orders/:id',
        component: OrdersDetailComponent,
      },
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // }
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
