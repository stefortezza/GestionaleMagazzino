import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiesteService } from '../service/richieste.service';
import { UserDetail } from 'src/interfaces/user-detail';

@Component({
  selector: 'app-segreteria',
  templateUrl: './segreteria.component.html',
  styleUrls: ['./segreteria.component.scss']
})
export class SegreteriaComponent implements OnInit {
  users: UserDetail[] = [];
  selectedFiles: { [key: number]: File[] } = {};
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' | null = null;
  isLoading: { [key: number]: boolean } = {};
  showModal: boolean = false;
  currentUserId: number | null = null;

  constructor(private richiesteService: RichiesteService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.richiesteService.getAllUsers().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        this.selectedFiles[user.userId] = [];
        this.isLoading[user.userId] = false; 
      });
    });
  }

  onFilesSelected(event: any, userId: number): void {
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles[userId] = this.selectedFiles[userId] ? [...this.selectedFiles[userId], ...files] : files;
  }

  removeFile(userId: number, index: number): void {
    if (this.selectedFiles[userId]) {
      this.selectedFiles[userId].splice(index, 1);
    }
  }

  showConfirmationModal(userId: number): void {
    this.currentUserId = userId;
    this.showModal = true;
  }

  confirmSubmit(): void {
    if (this.currentUserId !== null) {
      this.uploadFiles(this.currentUserId);
    }
    this.showModal = false;
  }

  cancelSubmit(): void {
    this.showModal = false;
  }

  uploadFiles(userId: number): void {
    if (this.selectedFiles[userId]?.length > 0) {
      this.isLoading[userId] = true; 
      const formData = new FormData();
      this.selectedFiles[userId].forEach(file => formData.append('files', file));
      
      this.richiesteService.uploadFiles(userId, formData).subscribe(
        response => {
          this.notificationMessage = 'Email inviata con successo!';
          this.notificationType = 'success';
          this.resetFileInput(userId);
          this.isLoading[userId] = false; 
          setTimeout(() => {
            this.notificationMessage = null;
            this.notificationType = null;
          }, 3000);
        },
        error => {
          console.error('Errore durante l\'invio del file:', error);
          this.notificationMessage = 'Errore durante l\'invio del file: ' + (error.error.message || error.message);
          this.notificationType = 'error';
          this.resetFileInput(userId);
          this.isLoading[userId] = false;
          setTimeout(() => {
            this.notificationMessage = null;
            this.notificationType = null;
          }, 3000);
        }
      );
    } else {
      this.notificationMessage = 'Seleziona dei file per l\'utente';
      this.notificationType = 'error';
      setTimeout(() => {
        this.notificationMessage = null;
        this.notificationType = null;
      }, 3000);
    }
  }

  private resetFileInput(userId: number): void {
    this.selectedFiles[userId] = [];
    const fileInput = document.querySelector(`input[type="file"][data-user-id="${userId}"]`);
    if (fileInput) {
      (fileInput as HTMLInputElement).value = '';
    }
  }

  isLoadingForUser(userId: number): boolean {
    return this.isLoading[userId] || false; 
  }
}
