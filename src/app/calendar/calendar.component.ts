import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Evento } from 'src/interfaces/evento';
import { SharedService } from '../service/shared-service.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  meseCorrente: Date;
  giorni: (number | null)[] = [];
  eventi: Evento[] = [];
  form: FormGroup;
  giorniSettimana: string[] = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  giornoSelezionato: number | null = null;
  eventoInModifica: Evento | null = null; // Evento attualmente in modifica
  isEditing = false; // Flag per determinare se siamo in modalità modifica
  isAdmin = false; // Flag per determinare se l'utente è amministratore
  showModal = false; // Flag per mostrare/nascondere il modale di conferma
  eventoDaEliminare: Evento | null = null; // Evento da eliminare
  nomiMesi: string[] = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  constructor(
    private fb: FormBuilder,
    private richiesteService: RichiesteService,
    private sharedService: SharedService
  ) {
    this.meseCorrente = new Date();
    this.form = this.fb.group({
      data: ['', Validators.required],
      titolo: ['', Validators.required],
      descrizione: ['']
    });

    this.sharedService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnInit(): void {
    this.generaCalendario();
    this.caricaEventi();
  }

  generaCalendario(): void {
    const anno = this.meseCorrente.getFullYear();
    const mese = this.meseCorrente.getMonth();

    this.giorni = [];

    const primoGiorno = new Date(anno, mese, 1).getDay();
    const ultimoGiorno = new Date(anno, mese + 1, 0).getDate();

    for (let i = 0; i < primoGiorno; i++) {
      this.giorni.push(null);
    }
    for (let i = 1; i <= ultimoGiorno; i++) {
      this.giorni.push(i);
    }
  }

  cambiaMese(offset: number): void {
    this.meseCorrente.setMonth(this.meseCorrente.getMonth() + offset);
    this.generaCalendario();
    this.caricaEventi();
  }

  get nomeMese(): string {
    return this.nomiMesi[this.meseCorrente.getMonth()];
  }

  get anno(): number {
    return this.meseCorrente.getFullYear();
  }

  selezionaGiorno(giorno: number | null): void {
    if (giorno === null) return; // Non fare nulla se il giorno è null

    this.giornoSelezionato = giorno;

    // Imposta il valore del campo 'data' del modulo
    const dataSelezionata = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    this.form.patchValue({
      data: dataSelezionata
    });

    // Carica gli eventi per il giorno selezionato
    this.caricaEventiDelGiorno(giorno);
  }

  caricaEventi(): void {
    this.richiesteService.getAllEventi().subscribe(eventi => {
      this.eventi = eventi;
    });
  }

  caricaEventiDelGiorno(giorno: number): void {
    const data = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    this.richiesteService.getAllEventi().subscribe(eventi => {
      this.eventi = eventi.filter(evento => evento.data === data);
    });
  }

  salvaEvento(): void {
    if (this.form.valid) {
      const evento: Evento = {
        data: this.form.value.data,
        titolo: this.form.value.titolo,
        descrizione: this.form.value.descrizione
      };

      if (this.isEditing && this.eventoInModifica && this.eventoInModifica.id !== undefined) {
        // Aggiorna l'evento esistente
        this.richiesteService.updateEvento(this.eventoInModifica.id, evento).subscribe(() => {
          this.caricaEventi();
          this.resetForm();
        });
      } else {
        // Aggiungi un nuovo evento
        this.richiesteService.addEvento(evento).subscribe(() => {
          this.caricaEventi();
          this.resetForm();
        });
      }
    }
  }

  modificaEvento(evento: Evento): void {
    this.isEditing = true;
    this.eventoInModifica = evento;
    this.form.patchValue({
      data: evento.data,
      titolo: evento.titolo,
      descrizione: evento.descrizione
    });
  }

  eliminaEvento(evento: Evento): void {
    this.showModal = true;
    this.eventoDaEliminare = evento;
  }

  confermaEliminazione(): void {
    if (this.eventoDaEliminare && this.eventoDaEliminare.id !== undefined) {
      this.richiesteService.deleteEvento(this.eventoDaEliminare.id).subscribe(() => {
        this.caricaEventi();
        this.showModal = false;
        this.eventoDaEliminare = null;
      });
    } else {
      console.error('ID dell\'evento non è definito.');
      this.showModal = false;
      this.eventoDaEliminare = null;
    }
  }

  annullaEliminazione(): void {
    this.showModal = false;
    this.eventoDaEliminare = null;
  }

  resetForm(): void {
    this.isEditing = false;
    this.eventoInModifica = null;
    this.form.reset();
  }

  classiGiorno(giorno: number | null): { [key: string]: boolean } {
    if (giorno === null) {
      return {};
    }

    const dataGiorno = new Date(this.anno, this.meseCorrente.getMonth(), giorno);
    const giornoConEvento = this.eventi.some(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento.getDate() === giorno &&
             dataEvento.getMonth() === this.meseCorrente.getMonth() &&
             dataEvento.getFullYear() === this.anno;
    });

    return {
      'giorno-selezionato': giorno === this.giornoSelezionato,
      'giorno-con-evento': giornoConEvento
    };
  }

  eventiFiltrati(): Evento[] {
    if (this.giornoSelezionato === null) return [];
    return this.eventi.filter(evento => {
      const dataEvento = new Date(evento.data);
      return dataEvento.getDate() === this.giornoSelezionato &&
             dataEvento.getMonth() === this.meseCorrente.getMonth() &&
             dataEvento.getFullYear() === this.anno;
    });
  }
}
