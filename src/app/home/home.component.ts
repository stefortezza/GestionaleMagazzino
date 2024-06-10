import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/categories')
      .subscribe(data => {
        this.categories = data;
      });
  }

  onCategoryChange(event: any): void {
    const categoryId = event.target.value;
    this.router.navigate(['/category', categoryId]);
  }
}
