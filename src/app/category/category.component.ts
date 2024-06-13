import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: string;
  idProducts: string;
  name: string;
  quantity: number;
  location: string;
  inputQuantity: number; 
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
  selectedMacchinario: string = '';
  categories: Category[] = [];
  selectedCategoria: Category | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.selectedMacchinario = params['macchinario'] || '';
      if (this.selectedMacchinario) {
        this.loadCategoriesFromServer();
      }
    });

    this.loadCategoriesFromLocalStorage();
  }

  loadCategoriesFromLocalStorage() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
      console.log('Categorie caricate dal local storage:', this.categories);
    } else {
      console.log('Nessuna categoria trovata nel local storage.');
    }
  }

  loadCategoriesFromServer() {
    this.http.get<any>('http://localhost:3000/macchinari').subscribe(
      (data) => {
        if (
          data &&
          typeof data === 'object' &&
          data.hasOwnProperty(this.selectedMacchinario)
        ) {
          const macchinarioData = data[this.selectedMacchinario];
          this.categories = macchinarioData.categories;
          localStorage.setItem('categories', JSON.stringify(this.categories));
          console.log(
            'Categorie aggiornate dal server e salvate nel local storage.'
          );
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

  updateQuantity(idProducts: string, quantity: number) {
    // Verifica se la categoria è stata selezionata
    if (!this.selectedCategoria) {
      console.error('Categoria non selezionata.');
      return;
    }
  
    // Trova il prodotto all'interno della categoria utilizzando il suo ID
    const productIndex = this.selectedCategoria.products.findIndex(
      (product) => product.idProducts === idProducts
    );
  
    // Se il prodotto non è stato trovato, mostra un errore
    if (productIndex === -1) {
      console.error('Prodotto non trovato.');
      return;
    }
  
    // Assicurati che la quantità inserita sia valida
    const inputQuantity = this.selectedCategoria.products[productIndex].inputQuantity || 0;
    if (isNaN(inputQuantity) || inputQuantity === 0) {
      console.error('Quantità non valida.');
      return;
    }
  
    // Modifica la quantità del prodotto in base all'azione richiesta
    this.selectedCategoria.products[productIndex].quantity += quantity;
  
    // Reset the input quantity
    this.selectedCategoria.products[productIndex].inputQuantity = 0;
  
    // Aggiorna la categoria nel database locale con il prodotto modificato
    const updatedCategories = this.categories.map((category) => {
      if (category.id === this.selectedCategoria!.id) {
        return this.selectedCategoria!;
      }
      return category;
    });
  
    // Salva il database locale aggiornato nel local storage
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
    // Aggiorna la categoria selezionata nel componente
    this.selectedCategoria = {
      ...this.selectedCategoria,
      products: [...this.selectedCategoria.products],
    };
  
    // Aggiorna il database remoto
    this.http.get<any>('http://localhost:3000/macchinari').subscribe(
      (data) => {
        if (
          data &&
          typeof data === 'object' &&
          data.hasOwnProperty(this.selectedMacchinario)
        ) {
          const allData = { ...data };
          allData[this.selectedMacchinario] = { categories: updatedCategories };
  
          this.http
            .put<any>('http://localhost:3000/macchinari', allData)
            .subscribe(
              (response) => {
                console.log('Database remoto aggiornato:', response);
              },
              (error) => {
                console.error("Errore nell'aggiornamento del database remoto:", error);
              }
            );
        } else {
          console.error('Errore nel caricamento dei dati dal server per aggiornamento.');
        }
      },
      (error) => {
        console.error('Errore nel caricamento dei dati dal server:', error);
      }
    );
  }
  
  
}
