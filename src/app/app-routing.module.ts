import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddMacchinarioComponent } from './add-macchinario/add-macchinario.component';
import { ModificaMacchinarioComponent } from './modifica-macchinario/modifica-macchinario.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'inserisci-macchinario', component: AddMacchinarioComponent },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'modifica-macchinario', component: ModificaMacchinarioComponent },
  { path: 'accedi', component: LoginComponent },
  { path: 'registrati', component: RegisterComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
