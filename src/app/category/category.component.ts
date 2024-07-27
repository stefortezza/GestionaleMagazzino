import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RichiesteService } from '../service/richieste.service';
import { LogService } from '../service/log.service';
import { SharedService } from '../service/shared-service.service';
import { Category } from 'src/interfaces/category';
import { Product } from 'src/interfaces/product';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  selectedMacchinarioId?: number;
  macchinarioName: string = ''; // Aggiungi questa proprietà per memorizzare il nome del macchinario
  selectedCategoria: Category | null = null;
  categories: Category[] = [];
  products: Product[] = [];
  quantityChange: number = 0;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private richiesteService: RichiesteService,
    private logService: LogService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.selectedMacchinarioId = id;
        this.loadMacchinario();  // Carica le informazioni del macchinario
      } else {
        console.error('ID del macchinario non valido:', id);
      }
    });

    this.sharedService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  loadMacchinario(): void {
    if (this.selectedMacchinarioId !== undefined) {
      this.richiesteService.getMacchinario(this.selectedMacchinarioId).subscribe(
        (macchinario: MacchinarioDTO) => {
          this.macchinarioName = macchinario.name; // Memorizza il nome del macchinario
          this.loadCategoriesForMacchinario();
        },
        (error) => {
          console.error('Errore nel caricamento del macchinario:', error);
        }
      );
    }
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

  loadProductsForCategory(categoryId: number): void {
    this.richiesteService.getProductsByMacchinarioAndCategory(this.selectedMacchinarioId || 0, categoryId).subscribe(
      (products: Product[]) => {
        this.products = products;
        console.log(`Prodotti caricati per le categorie ${categoryId}`);
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
          const message = `Ricambio utilizzato ${productName}: ${quantityChange}`;
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
