import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiURLCategories = environment.apiURL + '/categories';

  constructor(private http: HttpClient) {
  } 
  
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  getCategory(categoryId : string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(this.apiURLCategories + '/' + category.id, category);
  }

  deleteCategory(categoryId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLCategories}/${categoryId}`);
  }
}
