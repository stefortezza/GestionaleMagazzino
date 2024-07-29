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
  selectedDate: string | null = null;
  eventoDaEliminare: Evento | undefined;
  form: FormGroup;
  giorniSettimana: string[] = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  giornoSelezionato: number | null = null;
  eventoInModifica: Evento | null = null;
  isEditing = false;
  isAdmin = false;
  showModal = false;
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
      descrizione: [''],
      motivo: ['', Validators.required]
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

    // Corregge la numerazione dei giorni della settimana, che inizia da Domenica in JavaScript
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
    if (giorno === null) {
      return;
    }
  
    this.giornoSelezionato = giorno;
    this.selectedDate = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
  
    // Popola il modulo con la data selezionata
    this.form.patchValue({
      data: this.selectedDate
    });
  
    // Carica gli eventi del giorno selezionato
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
        descrizione: this.form.value.descrizione,
        motivo: this.form.value.motivo
      };

      if (this.isEditing && this.eventoInModifica && this.eventoInModifica.id !== undefined) {
        this.richiesteService.updateEvento(this.eventoInModifica.id, evento).subscribe(() => {
          this.caricaEventi();
          this.resetForm();
        });
      } else {
        this.richiesteService.addEvento(evento).subscribe(() => {
          this.caricaEventi();
          this.resetForm();
        });
      }
    }
  }

  resetForm(): void {
    this.form.reset();
    this.isEditing = false;
    this.eventoInModifica = null;
  }

  modificaEvento(evento: Evento): void {
    this.isEditing = true;
    this.eventoInModifica = evento;
    this.form.patchValue(evento);
  }

  eliminaEvento(evento: Evento): void {
    this.showModal = true;
    this.eventoDaEliminare = evento;
  }

  confermaEliminazione(): void {
    if (this.eventoDaEliminare && this.eventoDaEliminare.id !== undefined) {
      this.richiesteService.deleteEvento(this.eventoDaEliminare.id).subscribe(() => {
        this.caricaEventi();
        this.annullaEliminazione();
      });
    }
  }

  annullaEliminazione(): void {
    this.showModal = false;
    this.eventoDaEliminare = undefined;
  }

  eventiFiltrati(): Evento[] {
    if (this.giornoSelezionato === null) return [];

    const data = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(this.giornoSelezionato).padStart(2, '0')}`;
    return this.eventi.filter(evento => evento.data === data);
  }

  classiGiorno(giorno: number | null): any {
    if (giorno === null) {
      return { 'giorno-calendario': true };
    }
    
    const giornoStringa = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    const eventiDelGiorno = this.eventi.filter(evento => evento.data === giornoStringa);
  
    return {
      'giorno-calendario': true,
      'giorno-con-eventi': eventiDelGiorno.length > 0
    };
  }

  getPalliniForGiorno(giorno: number | null): string[] {
    if (giorno === null) return [];
    
    const giornoStringa = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    const eventiDelGiorno = this.eventi.filter(evento => evento.data === giornoStringa);

    // Restituisce un array di colori per ogni evento del giorno
    return eventiDelGiorno.map(evento => this.getColorForMotivo(evento.motivo));
  }

  getColorForMotivo(motivo: string): string {
    switch (motivo) {
      case 'MANUTENZIONE ORDINARIA':
        return 'yellow';
      case 'MANUTENZIONE PROGRAMMATA':
        return 'red';
      case 'LOGISTICA':
        return 'blue';
      case 'INFO PERSONALE':
        return 'green';
      case 'SCADENZE':
        return 'orange';
      case 'VERIFICHE':
        return 'violet';
      default:
        return 'white';
    }
  }
  
  getMotivoForGiorno(giorno: number | null): string {
    if (giorno === null) {
      return '';
    }
  
    const giornoStringa = `${this.anno}-${String(this.meseCorrente.getMonth() + 1).padStart(2, '0')}-${String(giorno).padStart(2, '0')}`;
    const eventiDelGiorno = this.eventi.filter(evento => evento.data === giornoStringa);
    
    return eventiDelGiorno.length > 0 ? eventiDelGiorno[0].motivo : '';
  }
}