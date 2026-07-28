import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { AstaService } from '../../service/asta.service';
import { PlayerCard } from "./player-card/player-card";
import { TeamTable } from "./team-table/team-table";
import { AssegnazionePayload, TipoSlot } from './model/player.model';

function formattaDurata(ms: number): string {
  const totaleSecondi = Math.max(0, Math.floor(ms / 1000));
  const ore = Math.floor(totaleSecondi / 3600);
  const minuti = Math.floor((totaleSecondi % 3600) / 60);
  const secondi = totaleSecondi % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(ore)}:${pad(minuti)}:${pad(secondi)}`;
}

@Component({
  selector: 'app-asta-live',
  imports: [PlayerCard, TeamTable],
  templateUrl: './asta-live.html',
  styleUrl: './asta-live.css',
})
export class AstaLive {

 protected readonly asta = inject(AstaService);
  protected readonly mostraSvincolati = signal(false);
  private readonly ora = signal(Date.now());

  protected readonly durataFormattata = computed(() => {
    const inizio = this.asta.dataInizio();
    if (!inizio) return '00:00:00';
    return formattaDurata(this.ora() - inizio);
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    const timerId = setInterval(() => {
      if (this.asta.astaTerminata()) {
        clearInterval(timerId);
        return;
      }
      this.ora.set(Date.now());
    }, 1000);
    destroyRef.onDestroy(() => clearInterval(timerId));
  }

  protected onAvviaAsta(): void {
    this.asta.avviaAsta();
  }

  protected onScarta(): void {
    this.asta.scartaGiocatore();
  }

  protected onAssegna(payload: AssegnazionePayload): void {
    this.asta.assegnaGiocatore(payload.coachId, payload.crediti);
  }

  protected onRimuoviGiocatore(
    coachId: number,
    evento: { tipoSlot: TipoSlot; indice: number; rimborsoTotale: boolean },
  ): void {
    this.asta.rimuoviGiocatore(coachId, evento.tipoSlot, evento.indice, evento.rimborsoTotale);
  }

  protected toggleSvincolati(): void {
    this.mostraSvincolati.update((v) => !v);
  }

}
