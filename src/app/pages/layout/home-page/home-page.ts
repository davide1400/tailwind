import { Component } from '@angular/core';
import { Cards } from "./cards/cards";

@Component({
  selector: 'app-home-page',
  imports: [Cards],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
