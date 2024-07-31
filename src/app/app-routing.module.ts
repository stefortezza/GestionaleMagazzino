import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-ricambio/add-product.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AddMacchinarioComponent } from './add-macchinario/add-macchinario.component';
import { ModificaMacchinarioComponent } from './modifica-macchinario/modifica-macchinario.component';
import { SectionHomeComponent } from './section-home/section-home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProduzioneComponent } from './produzione/produzione.component';
import { SegreteriaComponent } from './segreteria/segreteria.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'section-home', component: SectionHomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'inserisci-macchinario', component: AddMacchinarioComponent },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'modifica-macchinario', component: ModificaMacchinarioComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'produzione', component: ProduzioneComponent },
  { path: 'segreteria', component: SegreteriaComponent },
  { path: 'registrati', component: RegisterComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
