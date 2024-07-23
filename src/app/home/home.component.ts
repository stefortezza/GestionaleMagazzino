import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  email: string = '';
  password: string = '';
  macchinari: MacchinarioDTO[] = [];
  showLogin: boolean = false;

  constructor(
    private richiesteService: RichiesteService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
      this.showLogin = !isLoggedIn;
      if (isLoggedIn) {
        this.loadMacchinari();
      } else {
        this.macchinari = [];
      }
    });
  }

  login(loginForm: NgForm): void {
    if (loginForm.valid) {
      const userCredentials = { email: this.email, password: this.password };
      this.authService.login(userCredentials).subscribe({
        next: () => {
          this.email = '';
          this.password = '';
          this.loadMacchinari();
        },
        error: (error: any) => {
          console.error('Errore durante il login:', error);
        }
      });
    }
  }

  loadMacchinari(): void {
    this.richiesteService.getAllMachines().subscribe(
      (data: MacchinarioDTO[]) => {
        this.macchinari = data;
      },
      (error) => {
        console.error('Errore nel recupero dei macchinari:', error);
      }
    );
  }

  onMacchinarioChange(event: any): void {
    const selectedMacchinarioId = this.macchinari.find(macchinario => macchinario.name === event.target.value)?.id;
    if (selectedMacchinarioId) {
      this.router.navigate(['/category', selectedMacchinarioId]);
    } else {
      console.error('Nessun macchinario trovato con il nome:', event.target.value);
    }
  }
}
