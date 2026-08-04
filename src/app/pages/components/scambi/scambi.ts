import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamTradePanel } from './components/team-trade-panel/team-trade-panel';
import { TradeSummary } from './components/trade-summary/trade-summary';
import { TradeConfirmModal } from './components/trade-confirm-modal/trade-confirm-modal';
import { RiepilogoScambio, ScambiService } from '../../../service/scambi.service';
import { GiocatoreRosa } from './model/trade.model';
import { BackButton } from '../../../shared/back-button/back-button';

@Component({
  selector: 'app-scambi',
  standalone: true,
  imports: [CommonModule, TeamTradePanel, TradeSummary, TradeConfirmModal, BackButton],
  templateUrl: './scambi.html',
  styleUrl: './scambi.css',
  // Stato "scoped": ogni volta che si entra in /scambi si riparte da capo, coerente
  // con lo stesso pattern già adottato per AstaService.
  providers: [ScambiService],
})
export class Scambi {
  protected readonly scambi = inject(ScambiService);

  protected readonly riepilogoAperto = signal<RiepilogoScambio | null>(null);
  protected readonly caricamento = signal(false);
  protected readonly scambioCompletato = signal(false);

  protected onSquadraSinistraChange(id: number | null): void {
    this.scambi.selezionaSquadraSinistra(id);
  }

  protected onSquadraDestraChange(id: number | null): void {
    this.scambi.selezionaSquadraDestra(id);
  }

  protected onToggleGiocatoreSinistra(giocatore: GiocatoreRosa): void {
    this.scambi.toggleGiocatoreSinistra(giocatore);
  }

  protected onToggleGiocatoreDestra(giocatore: GiocatoreRosa): void {
    this.scambi.toggleGiocatoreDestra(giocatore);
  }

  protected onAnnullaScambio(): void {
    this.scambi.annullaScambio();
  }

  protected onAccettaScambio(): void {
    const riepilogo = this.scambi.costruisciRiepilogo();
    if (riepilogo) this.riepilogoAperto.set(riepilogo);
  }

  protected onAnnullaModale(): void {
    this.riepilogoAperto.set(null);
  }

  protected async onConfermaOperazione(): Promise<void> {
    const riepilogo = this.riepilogoAperto();
    if (!riepilogo) return;

    this.caricamento.set(true);
    await this.scambi.confermaScambio(riepilogo);
    this.caricamento.set(false);
    this.riepilogoAperto.set(null);
    this.scambioCompletato.set(true);
  }
}