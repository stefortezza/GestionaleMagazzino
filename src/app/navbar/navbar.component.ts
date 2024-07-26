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
  isAdmin: boolean = false;
  currentRoute: string = '';

  constructor(public authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
            this.user = this.authSrv.getCurrentUser();
            this.isAdmin = this.user?.user.roles.includes('ADMIN') || false;
        } else {
            this.user = null;
            this.isAdmin = false;
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
          this.user = this.authSrv.getCurrentUser();  
          this.isAdmin = this.user?.user.roles.includes('ADMIN') || false; 
          console.log('Is Admin after login:', this.isAdmin);
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
    this.isAdmin = false;
  }

  onSubmit(): void {
    this.authSrv.logout();
    this.user = null;
    this.isAdmin = false;
    this.router.navigate(['/home']);
  }
}
