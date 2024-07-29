import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from 'src/interfaces/category';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';
import { Product } from 'src/interfaces/product';
import { Evento } from 'src/interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class RichiesteService {
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) { }

  getAllMachines(): Observable<MacchinarioDTO[]> {
    return this.http.get<MacchinarioDTO[]>(`${this.apiUrl}/macchinario`).pipe(
      catchError(this.handleError)
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  getCategoriesByMacchinario(macchinarioId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/macchinario/${macchinarioId}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/categories/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByCategoryIds(categoryIds: number[]): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.apiUrl}/products/by-categories`, { categoryIds }).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByMacchinario(macchinarioId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/macchinario/${macchinarioId}`).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByMacchinarioAndCategory(macchinarioId: number, categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/macchinario/${macchinarioId}/categories/${categoryId}/products`).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  getMacchinario(macchinarioId: number): Observable<MacchinarioDTO> {
    return this.http.get<MacchinarioDTO>(`${this.apiUrl}/macchinario/${macchinarioId}`).pipe(
      catchError(this.handleError)
    );
  }

  getCategory(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateProductQuantity(macchinarioId: number, categoryId: number, productId: number, quantityChange: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/macchinario/${macchinarioId}/categories/${categoryId}/products/${productId}/update-quantity`,
      null, 
      { params: { quantityChange: quantityChange.toString() } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  addMacchinario(macchinario: MacchinarioDTO): Observable<MacchinarioDTO> {
    return this.http.post<MacchinarioDTO>(`${this.apiUrl}/macchinario`, macchinario).pipe(
      catchError(error => {
        if (error.status === 409) {
          return throwError('Il macchinario esiste già.');
        }
        return this.handleError(error);
      })
    );
  }

  updateMacchinario(id: number, macchinario: MacchinarioDTO): Observable<MacchinarioDTO> {
    return this.http.put<MacchinarioDTO>(`${this.apiUrl}/macchinario/${id}`, macchinario);
  }

  addCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category).pipe(
      catchError(error => {
        if (error.status === 409) {
          return throwError('La categoria esiste già.');
        }
        return this.handleError(error);
      })
    );
  }

  addProduct(product: { name: string, location: string, quantity: number, inputQuantity: number, categoryId: number }): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product).pipe(
      catchError(error => {
        if (error.status === 409) {
          return throwError('Un ricambio con lo stesso nome esiste già.');
        }
        return this.handleError(error);
      })
    );
  }

  inviaDati(data: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/sendEmail`, data, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }

  getMacchinarioById(macchinarioId: number): Observable<MacchinarioDTO> {
    return this.http.get<MacchinarioDTO>(`${this.apiUrl}/macchinario/${macchinarioId}`).pipe(
      catchError(this.handleError)
    );
  }

   // Metodi per la gestione degli eventi
   getAllEventi(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventi`).pipe(
      catchError(this.handleError)
    );
  }

  getEventoById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/eventi/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/eventi`, evento).pipe(
      catchError(this.handleError)
    );
  }

  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/eventi/${id}`, evento).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventi/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = `Codice errore: ${error.status}, messaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
