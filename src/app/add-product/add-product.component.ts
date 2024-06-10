import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: string = '';
  productName: string = '';
  productQuantity: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('http://localhost:3000/categories')
      .subscribe((data) => {
        this.categories = data;
      });
  }

  onSubmit(): void {
    const selectedCategory = this.categories.find(
      (category) => category.id === this.selectedCategoryId
    );
    if (selectedCategory) {
      const newProduct = {
        name: this.productName,
        quantity: this.productQuantity,
      };
      selectedCategory.products.push(newProduct);
      this.http
        .put(
          `http://localhost:3000/categories/${this.selectedCategoryId}`,
          selectedCategory
        )
        .subscribe(() => {
          // Reimposta i campi del form dopo l'invio
          this.productName = '';
          this.productQuantity = 0;
        });
    }
  }
}
