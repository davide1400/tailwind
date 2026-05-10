import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./pages/footer/footer";
import { Header } from "./pages/header/header";
import { AstaLive } from './pages/core/asta-live/asta-live';
import { Cards } from "./pages/core/asta-live/cards/cards";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AstaLive, Cards],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tailwind-app');

}
