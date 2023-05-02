import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './csodaasvanyok/home-page/home-page.component';
import { BlogPageComponent } from './csodaasvanyok/blog-page/blog-page.component';
import { CsodaasvanyokShellComponent } from './shared/csodaasvanyok-shell/csodaasvanyok-shell.component';

export const routes: Routes = [
  
  {
    path: '',
    component: CsodaasvanyokShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent,
      },
      {
        path: 'blog',
        component: BlogPageComponent,
      },
      {
        path: 'termekek',
        loadChildren: () => import('@csodaasvanyok-frontend-production/products').then(m => m.ProductsModule),
      },
      {
        path: 'termek/:id',
        loadChildren: () => import('@csodaasvanyok-frontend-production/products').then(m => m.ProductsModule),
      },
      
      
      //  {
      //    path: '',
      //    redirectTo: '',
      //    pathMatch: 'full'
      //  }
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
