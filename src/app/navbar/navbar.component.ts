import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AuthData } from 'src/interfaces/auth-data.interface';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: AuthData | null = null;
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  currentRoute: string = ''; // Aggiunta la variabile per il percorso corrente

  constructor(public authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.user = this.authSrv.getCurrentUser();
      } else {
        this.user = null;
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  login(): void {
    if (this.email && this.password) {
      const userCredentials = { email: this.email, password: this.password };
      this.authSrv.login(userCredentials).subscribe({
        next: (token) => {
          this.email = '';
          this.password = '';
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
        }
      });
    }
  }

  logout(): void {
    this.authSrv.logout();
    this.user = null;
  }
}
