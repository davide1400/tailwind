import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tailwind-app');

  constructor(){
    const theme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  switchTheme(){
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');

    if(currentTheme === 'dark'){
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }else{
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }


  }

}
