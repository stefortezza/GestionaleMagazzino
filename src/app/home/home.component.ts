import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  macchinari: any[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Carica l'elenco dei macchinari
    this.http.get<any>('http://localhost:3000/macchinari')
      .subscribe(
        (data) => {
          console.log("Dati macchinari:", data);
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            // Converti l'oggetto dei macchinari in un array di oggetti
            this.macchinari = Object.keys(data).map(key => ({ name: key, categories: data[key].categories }));
          } else {
            console.error("Errore nel caricamento dei macchinari: dati non validi.");
          }
        },
        (error) => {
          console.error("Errore nel caricamento dei macchinari:", error);
        }
      );
  }

  onMacchinarioChange(event: any): void {
    const selectedMacchinario = event.target?.value;
    console.log("Macchinario selezionato:", selectedMacchinario);
    // Naviga alla pagina category e passa il macchinario selezionato come parametro
    this.router.navigate(['/category'], { queryParams: { macchinario: selectedMacchinario } });
  }
}
