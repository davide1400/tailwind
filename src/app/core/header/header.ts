import { Component } from '@angular/core';
import { faFutbol, faGavel, faPalette, faPeopleGroup, faPersonWalking } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  faBall = faFutbol;
  faGavel = faGavel;
  faUsers = faPersonWalking;
  faPalette = faPalette;
  faPeopleGroup = faPeopleGroup;

  constructor() {
    const theme = localStorage.getItem('theme') ?? 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  switchTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}
