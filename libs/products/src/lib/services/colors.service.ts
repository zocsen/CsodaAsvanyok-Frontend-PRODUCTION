import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Color } from '../models/color';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  private apiURLColors = environment.apiURL + '/colors';

  constructor(private http: HttpClient) {
  } 
  
  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiURLColors);
  }

  getColor(colorId : string): Observable<Color> {
    return this.http.get<Color>(`${this.apiURLColors}/${colorId}`);
  }

  createColor(color: Color): Observable<Color> {
    return this.http.post<Color>(this.apiURLColors, color);
  }

  updateColor(color: Color): Observable<Color> {
    return this.http.put<Color>(this.apiURLColors + '/' + color.id, color);
  }

  deleteColor(colorId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLColors}/${colorId}`);
  }
}
