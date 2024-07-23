import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LogService } from '../service/log.service';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

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

  constructor(private logService: LogService, private richiesteService: RichiesteService) {
    this.logClearedSubscription = this.logService.logCleared$.subscribe(() => {
      this.loadLogEntries();
    });
  }

  ngOnInit(): void {
    this.loadLogEntries();
  }

  ngOnDestroy(): void {
    this.logClearedSubscription.unsubscribe();
  }

  inviaDati(): void {
    const emailData = {
      to: 'cultrerarek@gmail.com',
      subject: 'Dati dal tuo sistema',
      body: this.formatLogEntriesAsHtml(this.logEntries.filter(entry => entry.message.toLowerCase().includes('quantità modificata'))) +
            `<p>Note dell'utente: ${this.userNotes}</p>`
    };

    this.richiesteService.inviaDati(emailData).subscribe(
      () => {
        console.log('Email inviata con successo.');
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
    this.logEntries = this.logService.getLogEntries().filter(entry => entry.message.toLowerCase().includes('quantità modificata'));
  
    // Carica i nomi dei macchinari
    const macchinarioIds = Array.from(new Set(this.logEntries.map(entry => entry.macchinario).filter(id => !isNaN(Number(id)))));
    macchinarioIds.forEach(id => {
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        this.richiesteService.getMacchinario(numericId).subscribe(
          macchinario => {
            this.macchinarioNames[id] = macchinario.name;
            console.log(`Nome macchinario ${id}: ${macchinario.name}`); // Aggiungi questo log per debugging
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
