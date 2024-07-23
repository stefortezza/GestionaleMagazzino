import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];

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

  onSubmit(): void {
    if (this.productForm.valid) {
      this.richiesteService.addProduct(this.productForm.value).subscribe(
        response => {
          console.log('Prodotto aggiunto con successo', response);
          // Resetta il form dopo l'aggiunta del prodotto
          this.productForm.reset({
            quantity: 0,
            inputQuantity: 0
          });
        },
        error => {
          console.error('Errore nell\'aggiunta del prodotto', error);
        }
      );
    }
  }
}
