import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { filter } from 'rxjs';
import { auth } from './core/app.config';
import { Footer } from './core/footer/footer';
import { Header } from './core/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tailwind-app');
  // Ascoltiamo il cambiamento di rotta
  private readonly router = inject(Router);
  // Rappresenta la rotta attiva
  private readonly activedRoute = inject(ActivatedRoute);
  readonly headerNascosto = signal(false);

  constructor(){
    //Controllo la rotta al primo caricamento
    this.aggiornaVisibilitaHeader();

    //Ascolta solamente le navigazioni concluse correttamente
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        )
      )
      .subscribe(() => {
    this.aggiornaVisibilitaHeader();

      })
  }

  private aggiornaVisibilitaHeader() {
    let route = this.activedRoute;

    while(route.firstChild){
      route = route.firstChild;
    }

    this.headerNascosto.set(
      route.snapshot.data['nascondiMenu'] === true
    )
  }

  signWithGoogle(){
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(response => {
      console.log(response);
    })
  }

}


