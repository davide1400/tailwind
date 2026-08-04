import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiocatoreRosa } from '../../model/trade.model';

@Component({
  selector: 'app-trade-summary',
  imports: [CommonModule],
  templateUrl: './trade-summary.html',
  styleUrl: './trade-summary.css',
})
export class TradeSummary {
  nomeSquadraSinistra = input<string | null>(null);
  nomeSquadraDestra = input<string | null>(null);
  cedutiDaSinistra = input.required<GiocatoreRosa[]>();
  cedutiDaDestra = input.required<GiocatoreRosa[]>();
  scambioValido = input.required<boolean>();

  accetta = output<void>();
  annulla = output<void>();
}