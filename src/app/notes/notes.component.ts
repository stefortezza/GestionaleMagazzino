import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogService } from '../service/log.service';
import { RichiesteService } from '../service/richieste.service';
import { AuthService } from '../auth/auth.service'; // Importa AuthService

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {
  logEntries: { message: string, macchinario: string }[] = [];
  macchinarioNames: { [id: string]: string } = {}; // Mappa per memorizzare i nomi dei macchinari
  userNotes: string = ''; // Nuova proprietà per memorizzare il testo della textarea
  private logClearedSubscription: Subscription;
  private userSubscription: Subscription = new Subscription;
  isAdmin: boolean = false; // Variabile per il ruolo dell'utente

  constructor(
    private logService: LogService,
    private richiesteService: RichiesteService,
    private authService: AuthService // Inietta AuthService
  ) {
    this.logClearedSubscription = this.logService.logCleared$.subscribe(() => {
      this.loadLogEntries();
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const currentUser = this.authService.getCurrentUser();
        this.isAdmin = currentUser?.user?.roles.includes('ADMIN') || false;
      } else {
        this.isAdmin = false;
      }
      this.loadLogEntries();
    });
  }

  ngOnDestroy(): void {
    this.logClearedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  inviaDati(): void {
    const emailData = {
      to: 'stefano.fortezza98@hotmail.it',
      subject: 'Dati dal tuo sistema',
      body: this.formatLogEntriesAsHtml(this.logEntries.filter(entry => entry.message.toLowerCase().includes('quantità modificata'))) +
            `<p>Note dell'utente: ${this.userNotes}</p>`
    };

    this.richiesteService.inviaDati(emailData).subscribe(
      () => {
        this.clearLog();
      },
      (error) => {
        console.error('Errore nell\'invio dell\'email:', error);
      }
    );
  }

  formatLogEntriesAsHtml(entries: { message: string, macchinario: string }[]): string {
    return `
      <ul>
        ${entries.map(entry => `<li>${entry.message.replace('Quantità', 'Quantit&agrave;')}</li>`).join('')}
      </ul>
    `;
  }

  loadLogEntries(): void {
    this.logEntries = this.logService.getLogEntries().filter(entry => 
      this.isAdmin || entry.message.toLowerCase().includes('quantità modificata')
    );
    console.log('Filtered Log Entries:', this.logEntries); // Aggiungi questa riga per debug
  
    // Carica i nomi dei macchinari
    const macchinarioIds = Array.from(new Set(this.logEntries.map(entry => entry.macchinario).filter(id => !isNaN(Number(id)))));
    macchinarioIds.forEach(id => {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        this.richiesteService.getMacchinario(numericId).subscribe(
          macchinario => {
            this.macchinarioNames[id] = macchinario.name;
          },
          error => console.error('Errore nel caricamento del macchinario:', error)
        );
      } else {
        console.error(`ID macchinario non valido: ${id}`);
      }
    });
  }
  

  clearLog(): void {
    this.logService.clearLog();
    this.logEntries = [];
    this.userNotes = ''; // Reset del testo della textarea
  }
}
