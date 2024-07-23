import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-add-macchinario',
  templateUrl: './add-macchinario.component.html',
  styleUrls: ['./add-macchinario.component.scss']
})
export class AddMacchinarioComponent implements OnInit {
  macchinarioForm: FormGroup;
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryIds: number[] = [];
  selectedProductIds: number[] = [];

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {
    this.macchinarioForm = this.fb.group({
      name: ['', Validators.required],
      categoryIds: [[]],  // Permetti la selezione multipla
      productIds: [[]]  // Permetti la selezione multipla
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

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const categoryId = Number(target.value);

    if (target.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }

    if (this.selectedCategoryIds.length > 0) {
      this.richiesteService.getProductsByCategoryIds(this.selectedCategoryIds).subscribe(
        (products: Product[]) => {
          this.products = products;
          this.macchinarioForm.get('productIds')?.setValue([]);  // Reset dei prodotti selezionati
        },
        error => {
          console.error('Errore nel caricamento dei prodotti', error);
        }
      );
    } else {
      this.products = []; // Reset dei prodotti se nessuna categoria è selezionata
    }
  }

  onProductChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const productId = Number(target.value);

    if (target.checked) {
      this.selectedProductIds.push(productId);
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
    }
  }

  isFormValid(): boolean {
    const nameControl = this.macchinarioForm.get('name');
    return (nameControl?.valid ?? false) && this.selectedCategoryIds.length > 0 && this.selectedProductIds.length > 0;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const macchinarioDTO: MacchinarioDTO = {
        id: 0,
        name: this.macchinarioForm.get('name')?.value,
        categoryIds: this.selectedCategoryIds,
        productIds: this.selectedProductIds, // Assicurati che solo i prodotti selezionati siano inclusi
        categories: [],
        products: []
      };
  
      console.log('Macchinario DTO inviato:', macchinarioDTO);
  
      this.richiesteService.addMacchinario(macchinarioDTO).subscribe(
        response => {
          console.log('Macchinario aggiunto con successo', response);
          this.macchinarioForm.reset();
          this.products = [];
          this.selectedCategoryIds = [];
          this.selectedProductIds = [];
        },
        error => {
          console.error('Errore nell\'aggiunta del macchinario', error);
        }
      );
    }
  }   
}
