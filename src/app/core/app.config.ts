import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';

// import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxio_4pLc8aPlcAAW1KQCFSdlF82DhzFo",
  authDomain: "fantacalciorosaccio.firebaseapp.com",
  projectId: "fantacalciorosaccio",
  storageBucket: "fantacalciorosaccio.firebasestorage.app",
  messagingSenderId: "237329938534",
  appId: "1:237329938534:web:f5b7e0eed53e778b6f95a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
