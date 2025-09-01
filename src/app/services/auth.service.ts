import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
  return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { username, password }).pipe(
    map(res => {
      if (res && res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    }),
    catchError(err => throwError(() => err))
  );
}


  logout() {
    localStorage.removeItem('jwt_token'); 
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
