import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-add-macchinario',
  templateUrl: './add-macchinario.component.html',
  styleUrls: ['./add-macchinario.component.scss']
})
export class AddMacchinarioComponent implements OnInit {
  macchinarioForm: FormGroup;
  macchinari: MacchinarioDTO[] = [];

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {
    this.macchinarioForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMacchinari();
  }

  loadMacchinari(): void {
    this.richiesteService.getAllMachines().subscribe(
      (macchinari: MacchinarioDTO[]) => {
        this.macchinari = macchinari;
      },
      error => {
        console.error('Errore nel caricamento dei macchinari', error);
      }
    );
  }

  onSubmit(): void {
    if (this.macchinarioForm.valid) {
      const newName = this.macchinarioForm.value.name.trim(); // Rimuove eventuali spazi bianchi prima e dopo il nome
      // Verifica se esiste già un macchinario con lo stesso nome
      const existingMacchinario = this.macchinari.find(macchinario => macchinario.name.toLowerCase() === newName.toLowerCase());

      if (existingMacchinario) {
        // Se esiste già un macchinario con questo nome, mostra un alert
        window.alert(`Macchinario '${newName}' già presente!`);
      } else {
        // Altrimenti, procedi con l'aggiunta del macchinario
        this.richiesteService.addMacchinario(this.macchinarioForm.value).subscribe(
          response => {
            console.log('Macchinario aggiunto con successo', response);
            // Resetta il form dopo l'aggiunta del macchinario
            this.macchinarioForm.reset();
            // Aggiorna la lista dei macchinari
            this.loadMacchinari();
          },
          error => {
            console.error('Errore nell\'aggiunta del macchinario', error);
            // Gestisci l'errore (es. mostra un messaggio all'utente)
          }
        );
      }
    } else {
      // Form non valido, gestisci l'errore (es. mostra un messaggio all'utente)
    }
  }
}
