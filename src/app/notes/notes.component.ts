// notes.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogService } from '../service/log.service';
import { RichiesteService } from '../service/richieste.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {
  logEntries: { message: string, macchinario: string }[] = [];
  macchinarioNames: { [id: string]: string } = {};
  userNotes: string = '';
  private logClearedSubscription: Subscription;
  private userSubscription: Subscription = new Subscription;
  isAdmin: boolean = false;
  showModal: boolean = false;
  isLoading: boolean = false; // Variabile per gestire lo stato di caricamento
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' | null = null;
  private notificationTimeout: any; // Timeout per nascondere la notifica

  constructor(
    private logService: LogService,
    private richiesteService: RichiesteService,
    private authService: AuthService
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
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
  }

  showConfirmationModal(): void {
    this.showModal = true;
  }

  confirmSubmit(): void {
    this.isLoading = true;
    this.inviaDati();
  }

  cancelSubmit(): void {
    this.showModal = false;
    this.isLoading = false;
  }

  inviaDati(): void {
    const emailData = {
      to: 'stefano.fortezza98@hotmail.it',
      subject: 'Dati dal tuo sistema',
      body: this.formatLogEntriesAsHtml(this.logEntries.filter(entry => entry.message.toLowerCase().includes('ricambio utilizzato'))) +
            `<p>Note dell'utente: ${this.userNotes}</p>`
    };

    this.richiesteService.inviaDati(emailData).subscribe(
      () => {
        this.clearLog();
        this.notificationMessage = 'Dati inviati con successo!';
        this.notificationType = 'success';
        this.showNotification();
      },
      (error) => {
        console.error('Errore nell\'invio dell\'email:', error);
        this.notificationMessage = 'Errore nell\'invio dei dati.';
        this.notificationType = 'error';
        this.showNotification();
      }
    ).add(() => {
      this.isLoading = false;
      this.showModal = false;
    });
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
      this.isAdmin || entry.message.toLowerCase().includes('ricambio utilizzato')
    );
  
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
    this.userNotes = '';
  }

  private showNotification(): void {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    this.notificationTimeout = setTimeout(() => {
      this.notificationMessage = null;
      this.notificationType = null;
    }, 3000); 
  }
}
