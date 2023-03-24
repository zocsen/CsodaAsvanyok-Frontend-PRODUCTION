import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuard, JwtInterceptor, UsersModule } from '@csodaasvanyok-frontend-production/users';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesService } from '@csodaasvanyok-frontend-production/products';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import { FieldsetModule } from 'primeng/fieldset';
import {MultiSelectModule} from 'primeng/multiselect';
import { MineralsFormComponent } from './pages/minerals/minerals-form/minerals-form.component';
import { MineralsListComponent } from './pages/minerals/minerals-list/minerals-list.component';
import { SubcategoriesFormComponent } from './pages/subcategories/subcategories-form/subcategories-form.component';
import { SubcategoriesListComponent } from './pages/subcategories/subcategories-list/subcategories-list.component';


const UX_MODULE = [
  CardModule,
  ToastModule,
  InputTextModule,
  TableModule,
  ToolbarModule,
  ButtonModule,
  ConfirmDialogModule,
  InputNumberModule,
  DropdownModule,
  InputTextareaModule,
  InputSwitchModule,
  TagModule,
  InputMaskModule,
  FieldsetModule,
  MultiSelectModule,
];
const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
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
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ShellComponent,
    SidebarComponent,
    CategoriesListComponent,
    CategoriesFormComponent,
    ProductsListComponent,
    ProductsFormComponent,
    UsersListComponent,
    UsersFormComponent,
    OrdersListComponent,
    OrdersDetailComponent,
    MineralsFormComponent,
    MineralsListComponent,
    SubcategoriesFormComponent,
    SubcategoriesListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    CardModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    TagModule,
    InputMaskModule,
    FieldsetModule,
    UsersModule,
    UX_MODULE,
  ],
  providers: [CategoriesService, MessageService, ConfirmationService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
