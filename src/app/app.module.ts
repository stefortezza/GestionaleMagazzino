import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddProductComponent } from './add-product/add-product.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './auth/token.interceptor';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AddMacchinarioComponent } from './add-macchinario/add-macchinario.component';
import { CommonModule } from '@angular/common';
import { ModificaMacchinarioComponent } from './modifica-macchinario/modifica-macchinario.component';
import { SectionHomeComponent } from './section-home/section-home.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    NotesComponent,
    CategoryComponent,
    AddCategoryComponent,
    AddProductComponent,
    RegisterComponent,
    LoginComponent,
    AddMacchinarioComponent,
    ModificaMacchinarioComponent,
    SectionHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor, // l'interceptor esiste ed è esposto a livello i app module e qualunque chiamata http passerà da lui
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
