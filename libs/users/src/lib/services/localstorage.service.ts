import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  setToken(token: any) {
    localStorage.setItem(TOKEN, token);
  }

  getToken() : string {
    return localStorage.getItem(TOKEN) || '';
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }
}
