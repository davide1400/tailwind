import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './core/footer/footer';
import { Header } from './core/header/header';
import { auth } from './core/app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tailwind-app');

  signWithGoogle(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(response => {
      console.log(response);
    })
  }

}


