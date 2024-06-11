import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Product {
  idProducts: string;
  name: string;
  quantity: number;
  location: string;
}

interface Category {
  id: string;
  name: string;
  location: string;
  products: Product[];
}
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  increaseQuantity(_t13: any) {
    throw new Error('Method not implemented.');
  }
  decreaseQuantity(_t13: any) {
    throw new Error('Method not implemented.');
  }
  removeItem(_t13: any) {
    throw new Error('Method not implemented.');
  }
  selectedMacchinario: string = '';
  categories: Category[] = [];
  selectedCategoria: Category | null = null;
  categoryName: any;
  category: any;
  deliveryCharge: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedMacchinario = params['macchinario'] || '';
      if (this.selectedMacchinario) {
        this.http.get<any>('http://localhost:3000/macchinari').subscribe(
          (data) => {
            if (
              data &&
              typeof data === 'object' &&
              data.hasOwnProperty(this.selectedMacchinario)
            ) {
              const macchinarioData = data[this.selectedMacchinario];
              this.categories = macchinarioData.categories;
              
              // Otteniamo la posizione del prodotto
              for (const category of this.categories) {
                for (const product of category.products) {
                  const productData = category.products.find((p: { idProducts: string; }) => p.idProducts === product.idProducts);
                  if (productData) {
                    product.location = productData.location;
                  }
                }
              }
            } else {
              console.error(
                'Errore nel caricamento delle categorie: dati non validi.'
              );
            }
          },
          (error) => {
            console.error('Errore nel caricamento delle categorie:', error);
          }
        );
      }
    });
    this.loadCategoriesFromLocalStorage();
    this.loadCategoriesFromServer();
  }
  loadCategoriesFromLocalStorage() {
    // Carica le categorie dal Local Storage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }
  }

  loadCategoriesFromServer() {
    // Carica le categorie dal server e aggiorna il Local Storage
    this.http.get<any>('http://localhost:3000/macchinari').subscribe(
      (data) => {
        // Aggiorna le categorie solo se il server restituisce dati validi
        if (
          data &&
          typeof data === 'object' &&
          data.hasOwnProperty(this.selectedMacchinario)
        ) {
          const macchinarioData = data[this.selectedMacchinario];
          this.categories = macchinarioData.categories;
          localStorage.setItem('categories', JSON.stringify(this.categories));
        } else {
          console.error(
            'Errore nel caricamento delle categorie: dati non validi.'
          );
        }
      },
      (error) => {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    );
  }

  onSelectCategoria(event: any): void {
    const selectedCategoryId = event.target.value;
    if (selectedCategoryId) {
      const foundCategory = this.categories.find(
        (category) => category.id === selectedCategoryId
      );
      if (foundCategory) {
        this.selectedCategoria = foundCategory;
        console.log('Categoria selezionata:', this.selectedCategoria);
      } else {
        console.error('Categoria non trovata con id:', selectedCategoryId);
      }
    } else {
      this.selectedCategoria = null;
    }
  }

  updateQuantity(productId: string, change: number): void {
    // Trova il prodotto e aggiorna la quantità nel Local Storage
    const category = this.categories.find((cat) =>
      cat.products.some((prod) => prod.idProducts === productId)
    );

    if (category) {
      const product = category.products.find(
        (prod) => prod.idProducts === productId
      );

      if (product) {
        product.quantity += change;
        localStorage.setItem('categories', JSON.stringify(this.categories));

        // Aggiorna il database JSON
        this.http
          .put(
            `http://localhost:3000/macchinari/${this.selectedMacchinario}/${category.id}/${productId}`,
            product
          )
          .subscribe(
            (response) => {
              console.log('Quantità aggiornata con successo:', response);
            },
            (error) => {
              console.error(
                "Errore durante l'aggiornamento della quantità:",
                error
              );
            }
          );
      } else {
        console.error('Prodotto non trovato con idProducts:', productId);
      }
    } else {
      console.error(
        'Categoria non trovata per il prodotto con idProducts:',
        productId
      );
    }
  }

}
