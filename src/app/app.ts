import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { Footer } from './core/footer/footer';
import { AstaLive } from './pages/asta-live/asta-live';
import { Cards } from './pages/asta-live/cards/cards';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AstaLive, Cards],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tailwind-app');

}
