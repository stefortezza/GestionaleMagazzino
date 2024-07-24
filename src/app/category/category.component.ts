import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RichiesteService } from '../service/richieste.service';
import { LogService } from '../service/log.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  selectedMacchinarioId?: number;
  selectedCategoria: Category | null = null;
  categories: Category[] = [];
  products: Product[] = [];
  quantityChange: number = 0;

  constructor(
    private route: ActivatedRoute,
    private richiesteService: RichiesteService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.selectedMacchinarioId = id;
        this.loadCategoriesForMacchinario();
      } else {
        console.error('ID del macchinario non valido:', id);
      }
    });
  }

  loadCategoriesForMacchinario(): void {
    if (this.selectedMacchinarioId !== undefined) {
      this.richiesteService.getCategoriesByMacchinario(this.selectedMacchinarioId).subscribe(
        (categories: Category[]) => {
          this.categories = categories;
        },
        (error) => {
          console.error('Errore nel caricamento delle categorie:', error);
        }
      );
    } else {
      console.error('ID del macchinario non definito.');
    }
  }

  onSelectCategoria(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCategoryId = +target.value;
    this.selectedCategoria = this.categories.find(category => category.id === selectedCategoryId) || null;

    if (this.selectedMacchinarioId && this.selectedCategoria) {
      this.loadProductsForCategory(this.selectedCategoria.id);
    } else {
      console.error('Categoria selezionata o ID macchinario non validi.');
    }
  }

  loadProductsForCategory(categoryIds: number): void {
    this.richiesteService.getProductsByMacchinarioAndCategory(this.selectedMacchinarioId || 0, categoryIds).subscribe(
      (products: Product[]) => {
        this.products = products;
        console.log(`Prodotti caricati per le categorie ${categoryIds}`);
      },
      (error) => {
        console.error('Errore nel caricamento dei prodotti:', error);
      }
    );
  }

  updateQuantity(productId: number, quantityChange: number): void {
    if (this.selectedMacchinarioId !== undefined && this.selectedCategoria !== null && productId !== undefined) {
      const product = this.products.find(p => p.id === productId);
      const productName = product ? product.name : 'Prodotto sconosciuto';
  
      this.richiesteService.updateProductQuantity(
        this.selectedMacchinarioId,
        this.selectedCategoria.id,
        productId,
        quantityChange
      ).subscribe(
        () => {
          const message = `Quantità modificata per prodotto ${productName}: ${quantityChange}`;
          if (this.selectedMacchinarioId) {
            this.richiesteService.getMacchinario(this.selectedMacchinarioId).subscribe(macchinario => {
              this.logService.addLogEntry({ message, macchinario: macchinario.name });
            });
          }
          console.log('Quantità aggiornata con successo.');
          
          if (this.selectedMacchinarioId !== undefined && this.selectedCategoria !== null) {
            this.loadProductsForCategory(this.selectedCategoria.id);
          }
        },
        error => {
          console.error('Errore nell\'aggiornamento della quantità:', error);
        }
      );
    } else {
      console.error('Dati insufficienti per aggiornare la quantità.');
    }
  }
}