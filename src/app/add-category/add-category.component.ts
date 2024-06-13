import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Product {
  idProducts: string;
  name: string;
  location: string;
  quantity: number;
  inputQuantity: number;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface Macchinario {
[x: string]: any;
  id: string;
  name: string; 
  categories: Category[];
}


interface ServerResponse {
  [key: string]: { name: string; categories: Category[] };
}


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  [x: string]: any;
  categoryName: string = '';
  selectedMacchinario: string = '';
  macchinari: Macchinario[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMacchinariFromServer();
  }

  loadMacchinariFromServer(): void {
    this.http.get<ServerResponse>('http://localhost:3000/macchinari').subscribe(
      (data) => {
        console.log('Data ricevuto dal server:', data);
        if (data) {
          this.macchinari = Object.keys(data).map(id => ({
            id: id,
            name: data[id].name, // Utilizza 'name' anziché 'nome'
            categories: data[id].categories
          }));
          console.log('Macchinari trovati:', this.macchinari);
        } else {
          console.error('Nessun macchinario trovato nel database.');
          this.macchinari = []; // Assegna un array vuoto nel caso non ci siano dati
        }
      },
      (error) => {
        console.error('Errore nel caricamento dei macchinari:', error);
        this.macchinari = []; // Assegna un array vuoto in caso di errore
      }
    );
  }
  
  

  private apiUrl = 'http://localhost:3000/macchinari';

  onSubmit(selectedMacchinario: string, macchinari: any[], categoryName: string) {
    // Verifica che sia stato selezionato un macchinario e che sia stato inserito un nome categoria
    if (!selectedMacchinario || !categoryName) {
      console.error('Macchinario o categoria non selezionati.');
      return;
    }
  
    // Cerca il macchinario all'interno dell'array di macchinari
    const macchinario = macchinari.find(m => m.id === selectedMacchinario);
    if (!macchinario) {
      console.error('Macchinario non trovato.');
      return;
    }
  
    // Crea una nuova categoria da aggiungere al macchinario
    const newCategory = {
      id: new Date().getTime().toString(),
      name: categoryName,
      products: []
    };
  
    // Aggiungi la nuova categoria al macchinario
    macchinario.categories.push(newCategory);
  
    // Ora `macchinario` contiene la categoria aggiornata con la nuova categoria aggiunta
  
    // Prepara il payload per l'aggiornamento sul server (opzionale, se necessario)
    const updatePayload = {
      [selectedMacchinario]: macchinario
    };
  
    // Invia i dati aggiornati al server utilizzando HttpClient
    this.http.put(`${this.apiUrl}/${selectedMacchinario}`, macchinario)
      .subscribe(
        response => {
          console.log('Dati aggiornati con successo sul server.', response);
          // Gestisci eventualmente la risposta del server o fornisce feedback all'utente
        },
        error => {
          console.error('Errore durante il salvataggio dei dati sul server.', error);
          // Gestisci l'errore e fornisce feedback all'utente
        }
      );
  }
  
}