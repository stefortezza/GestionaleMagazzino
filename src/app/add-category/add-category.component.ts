import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  macchinari: MacchinarioDTO[] = [];

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      macchinarioId: ['', Validators.required]
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
    if (this.categoryForm.valid) {
      const { name, macchinarioId } = this.categoryForm.value;
      
      // Verifica se esiste già una categoria con lo stesso nome per lo stesso macchinario
      const existingCategory = this.macchinari.find(m => m.id === macchinarioId)?.categories.find(c => c.name === name);
      if (existingCategory) {
        alert(`Categoria "${name}" già presente per il macchinario selezionato.`);
        return; // Interrompe l'esecuzione se la categoria esiste già
      }

      // Se la categoria non esiste già, procedi con l'aggiunta
      this.richiesteService.addCategory(this.categoryForm.value).subscribe(
        response => {
          console.log('Categoria aggiunta con successo', response);
          // Gestisci il successo
        },
        error => {
          console.error('Errore nell\'aggiunta della categoria', error);
          // Gestisci l'errore
        }
      );

      // Resetta il form dopo l'aggiunta
      this.categoryForm.reset();
    }
  }
}
