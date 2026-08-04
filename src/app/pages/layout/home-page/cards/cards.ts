import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HomeCard } from './model/home-card.model';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {


    // Struttura dinamica: aggiungere una nuova sezione dell'app = aggiungere un
  // elemento qui, il template si aggiorna da solo grazie al @for.
  protected readonly cards: HomeCard[] = [
    {
      title: 'Asta Live',
      subTitle: "Avvia l'asta random e costruisci le rose in tempo reale",
      imgUrl: 'assets/asta.png', // inserirai tu l'URL/path dell'immagine
      route: '/asta/live',
    },
    {
      title: 'Scambi',
      subTitle: 'Proponi e gestisci gli scambi di giocatori tra fantallenatori',
      imgUrl: 'assets/scambi.jpg', // inserirai tu l'URL/path dell'immagine
      route: '/scambi',
    },
  ];
}
