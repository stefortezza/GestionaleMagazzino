import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RichiesteService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getAllMachines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/macchinario`).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(macchinarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/macchinario/${macchinarioId}/categories`);
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/${categoryId}/products`);
  }

  updateProductQuantity(macchinarioId: number, categoryId: number, productId: string, quantityChange: number): Observable<any> {
    return this.http.put<any[]>(`${this.apiUrl}/macchinario/${macchinarioId}/categories/${categoryId}/products/${productId}`, { quantityChange });
  }

  addMacchinario(macchinario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/macchinario`, macchinario);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories`, category);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Codice errore: ${error.status}, messaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
