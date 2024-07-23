import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Non è necessario caricare i macchinari
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const { name } = this.categoryForm.value;

      // Se la categoria non esiste già, procedi con l'aggiunta
      this.richiesteService.addCategory({ name }).subscribe(
        response => {
          console.log('Categoria aggiunta con successo', response);
          // Gestisci il successo, ad esempio resettando il modulo o navigando da qualche parte
          this.categoryForm.reset();
        },
        error => {
          console.error('Errore nell\'aggiunta della categoria', error);
        }
      );
    }
  }
}
