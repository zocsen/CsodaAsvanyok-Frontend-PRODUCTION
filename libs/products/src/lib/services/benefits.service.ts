import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Benefit } from '../models/benefit';

@Injectable({
  providedIn: 'root'
})
export class BenefitsService {
  private apiURLBenefits = environment.apiURL + '/benefits';

  constructor(private http: HttpClient) {
  } 
  
  getBenefits(): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(this.apiURLBenefits);
  }

  getBenefit(benefitId : string): Observable<Benefit> {
    return this.http.get<Benefit>(`${this.apiURLBenefits}/${benefitId}`);
  }

  createBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.post<Benefit>(this.apiURLBenefits, benefit);
  }

  updateBenefit(benefit: Benefit): Observable<Benefit> {
    return this.http.put<Benefit>(this.apiURLBenefits + '/' + benefit.id, benefit);
  }

  deleteBenefit(benefitId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLBenefits}/${benefitId}`);
  }
}
