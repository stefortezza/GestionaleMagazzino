import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { MacchinarioDTO } from 'src/interfaces/macchinario-dto';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  macchinari: MacchinarioDTO[] = [];
  categories: any[] = [];

  constructor(private fb: FormBuilder, private richiesteService: RichiesteService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      quantity: [0, Validators.required],
      inputQuantity: [0, Validators.required],
      macchinarioId: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMacchinari();
  }

  loadMacchinari(): void {
    this.richiesteService.getAllMachines().subscribe(
      (macchinari: MacchinarioDTO[]) => {
        this.macchinari = macchinari;
      },
      error => {
        console.error('Errore nel caricamento dei macchinari', error);
      }
    );
  }

  onMacchinarioChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const macchinarioId = Number(target.value);
    this.richiesteService.getCategories(macchinarioId).subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      error => {
        console.error('Errore nel caricamento delle categorie', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.richiesteService.addProduct(this.productForm.value).subscribe(
        response => {
          console.log('Prodotto aggiunto con successo', response);
          // Resetta il form dopo l'aggiunta del prodotto
          this.productForm.reset({
            quantity: 0,
            inputQuantity: 0
          });
          this.categories = []; // Svuota le categorie selezionate
        },
        error => {
          console.error('Errore nell\'aggiunta del prodotto', error);
        }
      );
    }
  }
}
