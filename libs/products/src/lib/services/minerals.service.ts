import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Mineral } from '../models/mineral';

@Injectable({
  providedIn: 'root'
})
export class MineralsService {
  private apiURLMinerals = environment.apiURL + '/minerals';

  constructor(private http: HttpClient) {
  } 
  
  getMinerals(): Observable<Mineral[]> {
    return this.http.get<Mineral[]>(this.apiURLMinerals);
  }

  getMineral(mineralId : string): Observable<Mineral> {
    return this.http.get<Mineral>(`${this.apiURLMinerals}/${mineralId}`);
  }

  createMineral(mineral: Mineral): Observable<Mineral> {
    return this.http.post<Mineral>(this.apiURLMinerals, mineral);
  }

  updateMineral(mineral: Mineral): Observable<Mineral> {
    return this.http.put<Mineral>(this.apiURLMinerals + '/' + mineral.id, mineral);
  }

  deleteMineral(mineralId: string): Observable<object> {
    return this.http.delete<object>(`${this.apiURLMinerals}/${mineralId}`);
  }
}
