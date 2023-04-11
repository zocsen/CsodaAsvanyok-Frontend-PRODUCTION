import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {JwtInterceptor, UsersModule } from '@csodaasvanyok-frontend-production/users';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './admin/categories/categories-list/categories-list.component';
import { CategoriesService, ProductsModule } from '@csodaasvanyok-frontend-production/products';
import { CategoriesFormComponent } from './admin/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './admin/products/products-list/products-list.component';
import { ProductsFormComponent } from './admin/products/products-form/products-form.component';
import { UsersListComponent } from './admin/users/users-list/users-list.component';
import { UsersFormComponent } from './admin/users/users-form/users-form.component';
import { OrdersListComponent } from './admin/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './admin/orders/orders-detail/orders-detail.component';
import { HomePageComponent } from './csodaasvanyok/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@csodaasvanyok-frontend-production/ui';

import { MineralsFormComponent } from './admin/minerals/minerals-form/minerals-form.component';
import { MineralsListComponent } from './admin/minerals/minerals-list/minerals-list.component';
import { SubcategoriesFormComponent } from './admin/subcategories/subcategories-form/subcategories-form.component';
import { SubcategoriesListComponent } from './admin/subcategories/subcategories-list/subcategories-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import { CsodaasvanyokRoutingModule } from './csodaasvanyok-routing.module';
import { BlogPageComponent } from './csodaasvanyok/blog-page/blog-page.component';
import { CsodaasvanyokShellComponent } from './shared/csodaasvanyok-shell/csodaasvanyok-shell.component';



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
import { MultiSelectModule } from 'primeng/multiselect';
import { AccordionModule } from 'primeng/accordion';
import {ListboxModule} from 'primeng/listbox';
import { BenefitsListComponent } from './admin/benefits/benefits-list/benefits-list.component';
import { BenefitsFormComponent } from './admin/benefits/benefits-form/benefits-form.component';



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
  AccordionModule,
  ListboxModule
];
const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
   {
     path: '**',
     redirectTo: '',
     pathMatch: 'full'
   },
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
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    BlogPageComponent,
    CsodaasvanyokShellComponent,
    BenefitsListComponent,
    BenefitsFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    UsersModule,
    UiModule,
    UX_MODULE,
    AdminRoutingModule,
    CsodaasvanyokRoutingModule,
    AdminRoutingModule,
    CsodaasvanyokRoutingModule
  ],
  providers: [
    CategoriesService,
    MessageService,
    ConfirmationService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
