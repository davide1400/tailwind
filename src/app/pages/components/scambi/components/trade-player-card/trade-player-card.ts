import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { GiocatoreRosa } from '../../model/trade.model';
import { RUOLI_INFO } from '../../data/ruoli-scambi';


@Component({
  selector: 'app-trade-player-card',
  imports: [CommonModule],
  templateUrl: './trade-player-card.html',
  styleUrl: './trade-player-card.css',
})
export class TradePlayerCard {
  giocatore = input.required<GiocatoreRosa>();
  /** true = card cliccabile nel picker (mostra stato selezionato/disabilitato). */
  selezionabile = input(false);
  selezionato = input(false);
  disabilitato = input(false);

  selezionaClick = output<void>();

  protected readonly ruoliInfo = RUOLI_INFO;

  protected onClick(): void {
    if (this.selezionabile() && !this.disabilitato()) {
      this.selezionaClick.emit();
    }
  }
}