import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isNavbarActive: boolean = false;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Gestisci lo stato iniziale della navbar
    this.authSrv.user$.subscribe(isLoggedIn => {
      this.isNavbarActive = isLoggedIn || this.router.url === '/login'; // Navbar attiva se l'utente è loggato o su /login
    });

    // Ascolta le modifiche della rotta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.isNavbarActive = this.authSrv.getCurrentUser() !== null || currentUrl === '/login';
      }
    });
  }
}
