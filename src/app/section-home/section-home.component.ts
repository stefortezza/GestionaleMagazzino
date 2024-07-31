import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared-service.service';

@Component({
  selector: 'app-section-home',
  templateUrl: './section-home.component.html',
  styleUrls: ['./section-home.component.scss']
})
export class SectionHomeComponent {
  showModal: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private sharedService: SharedService) {
    // Iscriviti ai cambiamenti di isAdmin
    this.sharedService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  navigateTo(route: string): void {
    if (route === 'segreteria' && !this.isAdmin) {
      this.showModal = true;
      return;
    }
    this.router.navigate([`/${route}`]);
    localStorage.setItem('isNavbarActive', 'true'); // Mantieni la navbar attiva
  }

  closeModal(): void {
    this.showModal = false;
  }
}
