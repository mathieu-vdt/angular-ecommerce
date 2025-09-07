import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { DrawerModule }  from 'primeng/drawer';
import { ButtonModule }  from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PopoverModule } from 'primeng/popover';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarModule } from 'primeng/avatar';
import { CartService, CartItem } from '../../services/cart.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;     // souvent l'id ou email
  username?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  exp?: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ToolbarModule, OverlayBadgeModule,
    ButtonModule, DrawerModule, BadgeModule, PopoverModule, AvatarModule
  ],
  templateUrl: './navbar.html'
})
export class Navbar {
  sidebarVisible = false;

  // panier
  count$!: Observable<number>;
  items$!: Observable<CartItem[]>;

  // user depuis le token
  user: JwtPayload | null = null;

  constructor(private router: Router, public cart: CartService) {
    this.count$ = this.cart.count$;
    this.items$ = this.cart.items$;

    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log(jwtDecode<JwtPayload>(token))
        this.user = jwtDecode<JwtPayload>(token);
      } catch (e) {
        console.error('Token invalide', e);
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  // --- helpers
  get isLoggedIn(): boolean { return !!this.user; }
  get displayName(): string { return this.user?.username || this.user?.email || 'Account'; }
  get initials(): string {
    const s = this.user?.username || this.user?.email || 'A';
    return s.split(/\s+/).map(p => p[0]).join('').slice(0,2).toUpperCase();
  }
  get isAdmin(): boolean { return (this.user?.role || '').toLowerCase() === 'admin'; }

  // --- actions
  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.sidebarVisible = false;
    this.router.navigateByUrl('/');
  }

  removeFromCart(id: number) {
    this.cart.remove(id);
  }

  links = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    // { label: 'Products', icon: 'pi pi-shopping-bag', routerLink: '/' },
    { label: 'Contact', icon: 'pi pi-envelope', routerLink: '/contact' },
    { label: 'FAQ', icon: 'pi pi-question-circle', routerLink: '/faq' }
  ];
}
