import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiURLProducts = environment.apiURL + '/products';
  private selectedProduct: any;

  constructor(private http: HttpClient) {
  } 
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURLProducts);
  }

  getProduct(productId : string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  updateProduct(productData: FormData, productid: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiURLProducts}/${productid}`, productData);
  }

  deleteProduct(productId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  setSelectedProduct(product: Product): void {
    this.selectedProduct = product;
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  }

  getSelectedProduct(): any {
    if (!this.selectedProduct) {
    const storedProduct = localStorage.getItem('selectedProduct');
    if (storedProduct) {
      this.selectedProduct = JSON.parse(storedProduct);
    }
  }
  return this.selectedProduct;
}
}
