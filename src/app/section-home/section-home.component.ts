import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-home',
  templateUrl: './section-home.component.html',
  styleUrls: ['./section-home.component.scss']
})
export class SectionHomeComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
    localStorage.setItem('isNavbarActive', 'true'); // Mantieni la navbar attiva
  }
}
