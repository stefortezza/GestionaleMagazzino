import { ActivatedRoute } from "@angular/router";
import { Category } from "src/interfaces/category";
import { Product } from "src/interfaces/product";
import { RichiesteService } from "../service/richieste.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  selectedMacchinarioId: number | undefined;
  selectedCategoria: Category | null = null;
  categories: Category[] = [];
  loadingCategories: boolean = false;
  products: Product[] = [];

  constructor(private route: ActivatedRoute, private richiesteService: RichiesteService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.selectedMacchinarioId = id;
        console.log('Macchinario selezionato:', this.selectedMacchinarioId);
        this.loadCategoriesFromServer();
      } else {
        console.error('ID del macchinario non valido:', id);
      }
    });
  }

  loadCategoriesFromServer(): void {
    if (this.selectedMacchinarioId === undefined) {
      console.error('L\'id del macchinario non è valido:', this.selectedMacchinarioId);
      return;
    }
  
    this.loadingCategories = true;
  
    this.richiesteService.getCategories(this.selectedMacchinarioId).subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        console.log('Categorie aggiornate dal server:', this.categories);
      },
      (error) => {
        console.error('Errore nel caricamento delle categorie:', error);
        // Gestione degli errori
      }
    ).add(() => {
      this.loadingCategories = false;
    });
  }

  onSelectCategoria(event: any): void {
    const selectedCategoryId = +event.target.value;
    this.selectedCategoria = this.categories.find(category => category.id === selectedCategoryId) || null;
    console.log('Categoria selezionata:', this.selectedCategoria);

    if (selectedCategoryId) {
      this.loadProductsForCategory(selectedCategoryId);
    }
  }

  loadProductsForCategory(categoryId: number): void {
    this.richiesteService.getProductsByCategory(categoryId).subscribe(
      (products: Product[]) => {
        this.products = products;
        console.log('Prodotti associati alla categoria:', this.products);
      },
      (error) => {
        console.error('Errore nel caricamento dei prodotti:', error);
        // Gestione degli errori
      }
    );
  }

  updateQuantity(productId: string, categoryId: number, quantityChange: number): void {
    if (productId && quantityChange !== 0) {
      this.richiesteService.updateProductQuantity(this.selectedMacchinarioId!, categoryId, productId, quantityChange)
        .subscribe(
          () => {
            console.log('Quantità aggiornata nel macchinario.');
            if (this.selectedCategoria) {
              this.loadProductsForCategory(this.selectedCategoria.id);
            }
          },
          (error) => {
            console.error('Errore nell\'aggiornamento della quantità nel macchinario:', error);
            // Gestione degli errori
          }
        );
    }
  }
}
