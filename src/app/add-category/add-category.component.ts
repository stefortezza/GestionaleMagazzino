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
  errorMessage: string = '';  // Variabile per il messaggio di errore

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const { name } = this.categoryForm.value;
      this.richiesteService.addCategory({ name }).subscribe(
        response => {
          console.log('Categoria aggiunta con successo', response);
          this.resetForm();
        },
        error => {
          this.errorMessage = error;
          console.error('Errore nell\'aggiunta della categoria', error);
          setTimeout(() => this.resetForm(), 1500);  // Ritarda il reset
        }
      );
    }
  }

  private resetForm(): void {
    this.categoryForm.reset();
    this.errorMessage = '';  // Pulisce il messaggio di errore
  }
}
