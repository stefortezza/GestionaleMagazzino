import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  categoryName: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(): void {
    const newCategory = { name: this.categoryName, products: [] };
    this.http.post('http://localhost:3000/categories', newCategory)
      .subscribe(() => {
        this.router.navigate(['/home']);
      });
  }
}
