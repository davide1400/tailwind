import { Component } from '@angular/core';
import { Cards } from "./cards/cards";
import { Carousel } from "./carousel/carousel";

@Component({
  selector: 'app-home-page',
  imports: [Cards, Carousel],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
