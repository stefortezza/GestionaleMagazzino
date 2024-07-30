import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  errorMessage: string = '';  // Variabile per il messaggio di errore
  showModal: boolean = false; // Variabile per la visualizzazione della modale

  constructor(private fb: FormBuilder, private richiesteService: RichiesteService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      quantity: [0, Validators.required],
      inputQuantity: [0, Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.richiesteService.getAllCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      error => {
        console.error('Errore nel caricamento delle categorie', error);
      }
    );
  }

  showConfirmation(): void {
    if (this.productForm.valid) {
      this.showModal = true; // Mostra la modale di conferma
    }
  }

  confirmSubmit(): void {
    this.richiesteService.addProduct(this.productForm.value).subscribe(
      response => {
        console.log('Prodotto aggiunto con successo', response);
        this.resetForm();
        this.showModal = false; // Nascondi la modale
      },
      error => {
        if (error.status === 403) {
          this.errorMessage = 'Accesso negato. Verifica le tue credenziali e i permessi.';
        } else {
          this.errorMessage = 'Un ricambio con lo stesso nome esiste già.';
        }
        console.error('Errore nell\'aggiunta del prodotto', error);
        setTimeout(() => this.resetForm(), 1500); // Ritarda il reset
        this.showModal = false; // Nascondi la modale
      }
    );
  }

  cancelSubmit(): void {
    this.showModal = false; // Nascondi la modale
  }

  private resetForm(): void {
    this.productForm.reset({
      quantity: 0,
      inputQuantity: 0
    });
    this.errorMessage = ''; // Pulisce il messaggio di errore
  }
}
