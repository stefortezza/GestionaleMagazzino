import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RichiesteService } from '../service/richieste.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-modifica-macchinario',
  templateUrl: './modifica-macchinario.component.html',
  styleUrls: ['./modifica-macchinario.component.scss']
})
export class ModificaMacchinarioComponent implements OnInit {
  macchinarioId?: number;
  macchinarioForm: FormGroup;
  macchinarios: MacchinarioDTO[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryIds: number[] = [];
  selectedProductIds: number[] = [];

  constructor(
    private richiesteService: RichiesteService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.macchinarioForm = this.fb.group({
      name: ['', Validators.required],
      categoryIds: [[]],
      productIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadMacchinarios();
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.macchinarioId = +params['id'];
        this.loadMacchinario();
      }
    });
  }

  loadMacchinarios(): void {
    this.richiesteService.getAllMachines().subscribe(
      (macchinarios: MacchinarioDTO[]) => {
        this.macchinarios = macchinarios;
      },
      error => {
        console.error('Errore nel caricamento dei macchinari', error);
      }
    );
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
      this.richiesteService.getMacchinario(this.macchinarioId).subscribe(
        (macchinario: MacchinarioDTO) => {
          this.macchinarioForm.patchValue(macchinario);
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

  onMacchinarioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const macchinarioId = Number(target.value);

    if (macchinarioId) {
      this.macchinarioId = macchinarioId;
      this.loadMacchinario();
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
        id: this.macchinarioId!,
        name: this.macchinarioForm.get('name')?.value,
        categoryIds: this.selectedCategoryIds,
        productIds: this.selectedProductIds,
        categories: [],
        products: []
      };

      console.log('Macchinario DTO inviato:', macchinarioDTO);

      this.richiesteService.updateMacchinario(this.macchinarioId!, macchinarioDTO).subscribe(
        response => {
          console.log('Macchinario aggiornato con successo', response);
          this.router.navigate(['/home']);
          this.resetForm();
        },
        error => {
          console.error('Errore nell\'aggiornamento del macchinario', error);
        }
      );
    }
  }

  resetForm(): void {
    this.macchinarioForm.reset();
    this.products = [];
    this.selectedCategoryIds = [];
    this.selectedProductIds = [];
  }
}
