import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/interfaces/register.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name: string = '';
  surname: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private authSrv: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const user: Register = {
        name: this.name,
        surname: this.surname,
        username: this.username,
        email: this.email,
        password: this.password
      };

      this.authSrv.signUp(user).subscribe(
        () => {
          console.log('Registrazione completata con successo');
          alert('Registrazione completata con successo. Ora puoi effettuare il login.');
          this.router.navigate(['/accedi']);
        },
        (error) => {
          console.error('Errore durante la registrazione:', error);
          let errorMessage = 'Si è verificato un errore durante la registrazione.';
          if (error.status === 409) {
            errorMessage = 'L\'indirizzo email è già in uso. Per favore, scegli un altro.';
          } else if (error.status === 400) {
            errorMessage = 'I dati inseriti non sono validi. Per favore, verifica e riprova.';
          }
          alert(errorMessage);
        }
      );
    } else {
      console.error('Form non valido, verifica i campi.');
      alert('Per favore, inserisci correttamente tutti i campi richiesti.');
    }
  }
}