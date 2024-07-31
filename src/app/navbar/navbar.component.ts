// navbar.component.ts
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
  showWelcomeText: boolean = false; // Nuova proprietà per gestire la visibilità del div di benvenuto
  @Input() isNavbarActive: boolean = false;
  currentDate: string = '';
  daysFromStartOfYear: number = 0;  // Aggiungi questa proprietà
  currentPage: string = '';  // Nuova variabile per memorizzare la pagina corrente

  constructor(
    private authSrv: AuthService, 
    private router: Router,
    private sharedService: SharedService // Inietta il servizio condiviso
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();  // Imposta la data odierna
    this.calculateDaysFromStartOfYear();  // Calcola i giorni dall'inizio dell'anno
    this.authSrv.user$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.user = this.authSrv.getCurrentUser();
        this.isAdmin = this.user?.user?.roles.includes('ADMIN') || false;
        this.sharedService.setIsAdmin(this.isAdmin); // Imposta il valore isAdmin nel servizio condiviso
        this.updateShowAdditionalLinks();
        this.updateShowWelcomeText();
      } else {
        this.user = null;
        this.isAdmin = false;
        this.sharedService.setIsAdmin(this.isAdmin); // Imposta isAdmin a false nel servizio condiviso
        this.showAdditionalLinks = false;
        this.showWelcomeText = false; // Nasconde il div di benvenuto se non è loggato
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.urlAfterRedirects;
        this.updateShowAdditionalLinks();
        this.updateShowWelcomeText(); // Aggiorna la visibilità del div di benvenuto
      }
    });
  }

  setCurrentDate(): void {
    const today = new Date();
    // Usa la funzione `toLocaleDateString()` per ottenere la data nel formato desiderato
    this.currentDate = today.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  calculateDaysFromStartOfYear(): void {
    const start = new Date(new Date().getFullYear(), 0, 1); 
    const today = new Date();
    const diff = today.getTime() - start.getTime();
    this.daysFromStartOfYear = Math.ceil(diff / (1000 * 60 * 60 * 24));
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
    this.showWelcomeText = false; // Nasconde il div di benvenuto dopo il logout
    this.router.navigate(['/login']);
  }

  activateNavbar(): void {
    this.showAdditionalLinks = true;
  }

  onLogoClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/section-home']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private updateShowAdditionalLinks(): void {
    this.showAdditionalLinks = this.isLoggedIn &&
      this.currentPage !== '/produzione' &&
      this.currentPage !== '/calendar' &&
      this.currentPage !== '/segreteria' &&
      this.currentPage !== '/section-home'; // Aggiungi /section-home
  }

  private updateShowWelcomeText(): void {
    this.showWelcomeText = this.isLoggedIn && this.currentPage !== '/login';
  }
}
