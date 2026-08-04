import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradePlayerCard } from '../trade-player-card/trade-player-card';
import { GiocatoreRosa, SquadraFantacalcio } from '../../model/trade.model';

@Component({
  selector: 'app-team-trade-panel',
  imports: [CommonModule, TradePlayerCard],
  templateUrl: './team-trade-panel.html',
  styleUrl: './team-trade-panel.css',
})
export class TeamTradePanel {
  titolo = input.required<string>();
  squadre = input.required<SquadraFantacalcio[]>();
  squadraSelezionata = input<SquadraFantacalcio | null>(null);
  giocatoriCeduti = input.required<GiocatoreRosa[]>();
  maxGiocatori = input.required<number>();

  squadraChange = output<number | null>();
  toggleGiocatore = output<GiocatoreRosa>();

  protected readonly mostraPicker = signal(false);
  protected readonly limiteRaggiunto = computed(() => this.giocatoriCeduti().length >= this.maxGiocatori());

  protected onSquadraChange(event: Event): void {
    const valore = (event.target as HTMLSelectElement).value;
    this.mostraPicker.set(false);
    this.squadraChange.emit(valore ? Number(valore) : null);
  }

  protected onTogglePicker(): void {
    this.mostraPicker.update((v) => !v);
  }

  protected isSelezionato(giocatore: GiocatoreRosa): boolean {
    return this.giocatoriCeduti().some((g) => g.id === giocatore.id);
  }

  protected onSelezionaGiocatore(giocatore: GiocatoreRosa): void {
    this.toggleGiocatore.emit(giocatore);
  }
}