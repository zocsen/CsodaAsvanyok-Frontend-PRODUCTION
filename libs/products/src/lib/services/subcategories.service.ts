import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Subcategory } from '../models/subcategory';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  private apiURLSubcategories = environment.apiURL + '/subcategories';

  constructor(private http: HttpClient) {
  } 
  
  getSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(this.apiURLSubcategories);
  }

  getSubcategory(subcategoryId : string): Observable<Subcategory> {
    return this.http.get<Subcategory>(`${this.apiURLSubcategories}/${subcategoryId}`);
  }

  createSubcategory(subcategory: Subcategory): Observable<Subcategory> {
    return this.http.post<Subcategory>(this.apiURLSubcategories, subcategory);
  }

  updateSubcategory(subcategory: Subcategory): Observable<Subcategory> {
    return this.http.put<Subcategory>(this.apiURLSubcategories + '/' + subcategory.id, subcategory);
  }

  deleteSubcategory(subcategoryId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLSubcategories}/${subcategoryId}`);
  }
}
