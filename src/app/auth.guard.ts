import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private jwtHelper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (!token) {
      return this.router.parseUrl('/login');
    }

    try {
      const decoded: any = this.jwtHelper.decodeToken(token);
      const isExpired = this.jwtHelper.isTokenExpired(token);

      if (isExpired) {
        localStorage.removeItem('token');
        return this.router.parseUrl('/login');
      }

      if (decoded.role === 'ADMIN') {
        return true;
      } else {
        // si loggé mais pas ADMIN → redirection home
        return this.router.parseUrl('/');
      }
    } catch {
      localStorage.removeItem('token');
      return this.router.parseUrl('/login');
    }
  }
}
