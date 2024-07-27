import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-macchinario',
  templateUrl: './add-macchinario.component.html',
  styleUrls: ['./add-macchinario.component.scss']
})
export class AddMacchinarioComponent implements OnInit {
  @Input() macchinarioId?: number;
  macchinarioForm: FormGroup;
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryIds: number[] = [];
  selectedProductIds: number[] = [];
  errorMessage: string = '';  // Variabile per il messaggio di errore

  constructor(
    private richiesteService: RichiesteService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.macchinarioForm = this.fb.group({
      name: ['', Validators.required],
      categoryIds: [[]],  // Permetti la selezione multipla
      productIds: [[]]  // Permetti la selezione multipla
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.macchinarioId = +params['id'];
        this.loadMacchinario();
      }
    });
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

  loadMacchinario(): void {
    if (this.macchinarioId) {
      this.richiesteService.getMacchinarioById(this.macchinarioId).subscribe(
        (macchinario: MacchinarioDTO) => {
          this.macchinarioForm.patchValue({
            name: macchinario.name,
            categoryIds: macchinario.categoryIds,
            productIds: macchinario.productIds
          });
          this.selectedCategoryIds = macchinario.categoryIds;
          this.selectedProductIds = macchinario.productIds;
          this.loadProductsForCategories();
        },
        error => {
          console.error('Errore nel caricamento del macchinario', error);
        }
      );
    }
  }

  loadProductsForCategories(): void {
    if (this.selectedCategoryIds.length > 0) {
      this.richiesteService.getProductsByCategoryIds(this.selectedCategoryIds).subscribe(
        (products: Product[]) => {
          this.products = products;
        },
        error => {
          console.error('Errore nel caricamento dei prodotti', error);
        }
      );
    } else {
      this.products = [];
    }
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const categoryId = Number(target.value);

    if (target.checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }

    this.loadProductsForCategories();
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
        id: this.macchinarioId || 0,
        name: this.macchinarioForm.get('name')?.value,
        categoryIds: this.selectedCategoryIds,
        productIds: this.selectedProductIds,
        categories: [], // Non necessario per l'invio se non richiesto
        products: [] // Non necessario per l'invio se non richiesto
      };

      console.log('Macchinario DTO inviato:', macchinarioDTO);

      const request$ = this.macchinarioId
        ? this.richiesteService.updateMacchinario(this.macchinarioId, macchinarioDTO)
        : this.richiesteService.addMacchinario(macchinarioDTO);

      request$.subscribe(
        response => {
          console.log(this.macchinarioId ? 'Macchinario aggiornato con successo' : 'Macchinario aggiunto con successo', response);
          this.resetForm();
        },
        error => {
          this.errorMessage = error;  // Imposta il messaggio di errore
          console.error('Errore nell\'aggiunta o aggiornamento del macchinario', error);
          
          // Mantieni il messaggio di errore e resetta il modulo dopo un delay
          setTimeout(() => this.resetForm(), 1500);  // Ritarda il reset 
        }
      );
    }
  }

  resetForm(): void {
    this.macchinarioForm.reset();
    this.products = [];
    this.selectedCategoryIds = [];
    this.selectedProductIds = [];
    this.macchinarioForm.get('categoryIds')?.setValue([]);
    this.macchinarioForm.get('productIds')?.setValue([]);
    
    // Pulire il messaggio di errore solo dopo il reset
    this.errorMessage = '';  

    const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"][name="categoryCheckbox"]');
    categoryCheckboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });

    const productCheckboxes = document.querySelectorAll('input[type="checkbox"][name="productCheckbox"]');
    productCheckboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
  }
}
