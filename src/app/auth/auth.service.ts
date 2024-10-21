import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthData } from 'src/interfaces/auth-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://45.14.185.251:8080/auth';
  private token: string | null = null;
  private authSub = new BehaviorSubject<string | null>(this.getStoredUser());
  private userSubject = new BehaviorSubject<boolean>(false);
  user$: Observable<boolean> = this.userSubject.asObservable();
  user: AuthData | null = null;
  

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      this.authSub.next(storedUser);
      this.userSubject.next(true);
      this.updateCurrentUser();
    }
  }

  login(user: { email: string; password: string }): Observable<boolean> {
    return this.http.post<string>(`${this.apiURL}/login`, user, { responseType: 'text' as 'json' }).pipe(
      tap((token: string) => {
        this.token = token;
        this.authSub.next(token);
        localStorage.setItem('user', token);
        this.userSubject.next(true);
        this.updateCurrentUser();
      }),
      map(() => true),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  private updateCurrentUser(): void {
    this.user = this.getCurrentUser();
    console.log('Updated User:', this.user);
  }

  logout() {
    this.token = null;
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.userSubject.next(false);
    this.user = null;
  }

  private getStoredUser(): string | null {
    return localStorage.getItem('user');
  }

  getCurrentUser(): AuthData | null {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      const tokenData = this.parseJwt(storedUser);
      if (tokenData) {
        return {
          accessToken: storedUser,
          user: {
            id: tokenData.id,
            name: tokenData.name,
            surname: tokenData.surname,
            email: tokenData.email,
            roles: tokenData.roles
          }
        };
      }
    }
    return null;
  }

  signUp(user: { email: string; password: string }): Observable<string> {
    return this.http.post<string>(`${this.apiURL}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      console.log('Parsed JWT:', payload);
      return payload;
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('Error in AuthService:', error);
    return throwError('Errore durante la registrazione');
  }
}
