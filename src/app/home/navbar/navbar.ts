import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { DrawerModule }  from 'primeng/drawer';
import { ButtonModule }  from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PopoverModule } from 'primeng/popover';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { OverlayBadgeModule } from 'primeng/overlaybadge';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ToolbarModule, OverlayBadgeModule,
    ButtonModule, DrawerModule, BadgeModule, PopoverModule
  ],
  templateUrl: './navbar.html'
})
export class Navbar {
  isHome = false;
  sidebarVisible = false;
  isRegisterHovered = false;
  count$!: Observable<number>;
  items$!: Observable<CartItem[]>;
  
  get loginStyles() {
    return this.isHome
      ? { color: '#fff', backgroundColor: 'transparent' }
      : { color: '#262626', backgroundColor: 'transparent' };
  }


  get registerStyles() {
    if (this.isHome) {
      // HOME (/)
      return this.isRegisterHovered
        ? { color: '#262626', borderColor: '#fff', backgroundColor: '#fff' } // hover
        : { color: '#fff', borderColor: '#fff', backgroundColor: 'transparent' }; // normal
    } else {
      // AUTRES PAGES
      return {
        color: '#262626',
        borderColor: '#262626',
        backgroundColor: 'transparent'
      };
    }
  }

  constructor(private router: Router, public cart: CartService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isHome = e.urlAfterRedirects === '/';
        this.sidebarVisible = false;
      });
    
    this.count$ = this.cart.count$;
    this.items$ = this.cart.items$;
  }

  removeFromCart(id: number) {
    this.cart.remove(id);
  }

  get isLoggedIn(): boolean { return !!localStorage.getItem('token'); }
  logout() { localStorage.removeItem('token'); this.sidebarVisible = false; }

  links = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Products', icon: 'pi pi-shopping-bag', routerLink: '/products' },
    { label: 'Contact', icon: 'pi pi-envelope', routerLink: '/contact' },
    { label: 'FAQ', icon: 'pi pi-question-circle', routerLink: '/faq' }
  ];
}
