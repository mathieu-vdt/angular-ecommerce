import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.html',
    standalone: true,
    imports: [RouterModule, CommonModule]
})
export class Navbar{
    @ViewChild('navOpen') navOpen!: ElementRef<HTMLInputElement>;
  close() { if (this.navOpen) this.navOpen.nativeElement.checked = false; }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // renvoie true si un token existe
  }

  logout() {
    localStorage.removeItem('token');
  }

}