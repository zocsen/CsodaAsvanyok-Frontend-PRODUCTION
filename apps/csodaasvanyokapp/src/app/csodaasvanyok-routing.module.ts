import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './csodaasvanyok/home-page/home-page.component';
import { ProductListComponent } from './csodaasvanyok/product-list/product-list.component';
import { BlogPageComponent } from './csodaasvanyok/blog-page/blog-page.component';
import { CsodaasvanyokShellComponent } from './shared/csodaasvanyok-shell/csodaasvanyok-shell.component';

export const routes: Routes = [
  
  {
    path: '',
    component: CsodaasvanyokShellComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
    },
      {
        path: 'products',
        component: ProductListComponent,
    },
      {
        path: 'blog',
        component: BlogPageComponent,
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CsodaasvanyokRoutingModule { }
