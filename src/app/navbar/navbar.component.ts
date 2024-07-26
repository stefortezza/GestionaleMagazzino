import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AuthData } from 'src/interfaces/auth-data.interface';
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from '../service/shared-service.service';

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
  showAdditionalLinks: boolean = false;
  @Input() isNavbarActive: boolean = false;

  constructor(
    private authSrv: AuthService, 
    private router: Router,
    private sharedService: SharedService // Inietta il servizio condiviso
  ) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.user = this.authSrv.getCurrentUser();
        this.isAdmin = this.user?.user?.roles.includes('ADMIN') || false;
        this.sharedService.setIsAdmin(this.isAdmin); // Imposta il valore isAdmin nel servizio condiviso
        this.showAdditionalLinks = this.router.url !== '/login' && this.router.url !== '/section-home';
      } else {
        this.user = null;
        this.isAdmin = false;
        this.sharedService.setIsAdmin(this.isAdmin); // Imposta isAdmin a false nel servizio condiviso
        this.showAdditionalLinks = false;
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        if (currentUrl === '/login') {
          this.showAdditionalLinks = false;
        } else if (currentUrl === '/section-home') {
          this.showAdditionalLinks = false; 
        } else {
          this.showAdditionalLinks = this.isLoggedIn;
        }
      }
    });
  }

  login(): void {
    if (this.email && this.password) {
      const userCredentials = { email: this.email, password: this.password };
      this.authSrv.login(userCredentials).subscribe({
        next: success => {
          if (success) {
            this.user = this.authSrv.getCurrentUser();
            this.isAdmin = this.user?.user?.roles.includes('ADMIN') || false;
            this.sharedService.setIsAdmin(this.isAdmin); // Imposta il valore isAdmin nel servizio condiviso
            this.email = '';
            this.password = '';
            this.activateNavbar();
            this.router.navigate(['/section-home']);
          }
        },
        error: error => {
          console.error('Errore durante il login:', error);
        }
      });
    }
  }

  logout(): void {
    this.authSrv.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.sharedService.setIsAdmin(this.isAdmin); // Imposta isAdmin a false nel servizio condiviso
    this.showAdditionalLinks = false;
    this.router.navigate(['/login']);
  }

  activateNavbar(): void {
    this.showAdditionalLinks = true;
  }

  onLogoClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
