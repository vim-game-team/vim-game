import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;

  constructor() {
    this.app = initializeApp(environment.firebase);
    console.log('Firebase connected:', this.app.name);
  }

  getApp(): FirebaseApp {
    return this.app;
  }
}