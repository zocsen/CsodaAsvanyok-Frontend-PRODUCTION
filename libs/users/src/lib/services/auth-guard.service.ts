import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { LocalstorageService } from './localstorage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorage: LocalstorageService,
    private http: HttpClient
  ) { }

  canActivate() {
    const token = this.localStorage.getToken();

    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      
      // verify the JWT on the server-side
      return this.http.post(environment.apiURL + '/verifyToken', { token })
        .toPromise()
        .then((response: any) => {
          if (response.isValid && tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        })
        .catch(() => {
          this.router.navigate(['/login']);
          return false;
        });
    }

    this.router.navigate(['/login']);
    return false;
  }
  
  private _tokenExpired(expiration: number): boolean {
    return Math.floor((new Date).getTime() / 1000) >= expiration;
  }
}
