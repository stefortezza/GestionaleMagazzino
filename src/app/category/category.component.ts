import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(`http://localhost:3000/categories/${categoryId}`)
      .subscribe(data => {
        this.category = data;
      });
  }
  
  updateQuantity(product: any, change: number): void {
    product.quantity += change;
    // Aggiorna il server con la nuova quantità
    this.http.put(`http://localhost:3000/categories/${this.category.id}`, this.category)
      .subscribe();
  }

}
