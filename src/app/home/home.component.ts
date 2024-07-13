import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';
import { AuthService } from '../auth/auth.service'; // Importa il servizio di autenticazione
import { AuthData } from 'src/interfaces/auth-data.interface'; // Se necessario, importa il tipo AuthData

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  macchinari: MacchinarioDTO[] = [];
  user: AuthData | null = null; // Definisci una proprietà per l'utente autenticato

  constructor(
    private richiesteService: RichiesteService,
    private router: Router,
    private authService: AuthService // Inietta il servizio di autenticazione
  ) { }

  ngOnInit(): void {
    // Controlla se l'utente è autenticato
    this.authService.user$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.user = this.authService.getCurrentUser(); // Ottieni l'utente corrente
        this.loadMacchinari(); // Carica i macchinari solo se l'utente è autenticato
      } else {
        this.user = null;
        this.macchinari = []; // Azzera i macchinari se l'utente non è autenticato
      }
    });
  }

  loadMacchinari(): void {
    this.richiesteService.getAllMachines().subscribe(
      (data: MacchinarioDTO[]) => {
        this.macchinari = data;
        console.log('Dati macchinari:', this.macchinari);
      },
      (error) => {
        console.error('Errore nel recupero dei macchinari:', error);
      }
    );
  }

  onMacchinarioChange(event: any): void {
    const selectedMacchinario = event.target?.value;
    console.log("Macchinario selezionato:", selectedMacchinario);
    // Trova l'ID del macchinario selezionato
    const selectedMacchinarioId = this.macchinari.find(m => m.name === selectedMacchinario)?.id;
    if (selectedMacchinarioId) {
      // Naviga alla pagina category e passa l'id del macchinario selezionato come parametro
      this.router.navigate(['/category', selectedMacchinarioId]);
    } else {
      console.error('Nessun macchinario trovato con il nome:', selectedMacchinario);
    }
  }

  goToCategory(macchinarioName: string) {
    this.router.navigate(['/category'], { queryParams: { macchinario: macchinarioName } });
  }
}
