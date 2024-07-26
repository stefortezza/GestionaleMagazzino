import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logEntries: { message: string, macchinario: string }[] = [];
  private logSubject = new BehaviorSubject<{ message: string, macchinario: string }[]>(this.logEntries);

  logCleared$ = this.logSubject.asObservable();

  addLogEntry(entry: { message: string, macchinario: string }): void {
    this.logEntries.push(entry);
    this.logSubject.next(this.logEntries);
    this.saveLogEntries();
  }

  getLogEntries(): { message: string, macchinario: string }[] {
    return this.logEntries;
  }

  clearLog(): void {
    this.logEntries = [];
    this.logSubject.next(this.logEntries);
    localStorage.removeItem('logEntries');
  }

  private saveLogEntries(): void {
    localStorage.setItem('logEntries', JSON.stringify(this.logEntries));
  }

}
