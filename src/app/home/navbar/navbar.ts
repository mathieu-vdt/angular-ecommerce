import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.html',
    standalone: true,
    imports: [RouterModule]
})
export class Navbar{
    @ViewChild('navOpen') navOpen!: ElementRef<HTMLInputElement>;
  close() { if (this.navOpen) this.navOpen.nativeElement.checked = false; }
}