import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
