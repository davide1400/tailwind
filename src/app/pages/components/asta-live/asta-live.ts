import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlayerCard } from './player-card/player-card';
import { TeamTable } from './team-table/team-table';
import { AstaSetupModal } from '../asta-setup-modal/asta-setup-modal';
import { AstaService } from '../../../service/asta.service';
import { AssegnazionePayload, AstaConfig, TipoSlot } from './model/player.model';
import { BackButton } from "../../../shared/back-button/back-button";


function formattaDurata(ms: number): string {
  const totaleSecondi = Math.max(0, Math.floor(ms / 1000));
  const ore = Math.floor(totaleSecondi / 3600);
  const minuti = Math.floor((totaleSecondi % 3600) / 60);
  const secondi = totaleSecondi % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(ore)}:${pad(minuti)}:${pad(secondi)}`;
}

const COLONNE_GRIGLIA: Record<number, string> = {
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-5',
  10: 'lg:grid-cols-5',
  11: 'lg:grid-cols-6',
  12: 'lg:grid-cols-6 2xl:grid-cols-12',

};

@Component({
  selector: 'app-asta-live',
  standalone: true,
  imports: [CommonModule, PlayerCard, TeamTable, AstaSetupModal, BackButton],
  templateUrl: './asta-live.html',
  styleUrl: './asta-live.css',
  // STEP 6a: PUNTO CHIAVE. Con questo "providers", Angular crea una NUOVA istanza di
  // AstaService ogni volta che questo componente viene istanziato (cioè ogni volta che
  // il Router attiva la rotta /asta), invece di riusare quella globale dell'app.
  // Quando il componente viene distrutto (navighi via), la sua istanza di AstaService
  // viene distrutta con esso: tutta l'asta precedente sparisce davvero dalla memoria.
  providers: [AstaService],
})
export class AstaLive implements OnInit {
  protected readonly asta = inject(AstaService);
  private readonly router = inject(Router);

  protected readonly mostraSvincolati = signal(false);
  protected readonly mostraModaleSetup = signal(false);

  // STEP 6b: stato per la modale di conferma del bottone "Indietro".
  protected readonly mostraModaleIndietro = signal(false);

  private readonly ora = signal(Date.now());

  protected readonly durataFormattata = computed(() => {
    const inizio = this.asta.dataInizio();
    if (!inizio) return '00:00:00';
    return formattaDurata(this.ora() - inizio);
  });

  protected readonly classiGriglia = computed(() => {
    const n = this.asta.coaches().length;
    return COLONNE_GRIGLIA[n] ?? 'lg:grid-cols-4';
  });

  protected readonly tipoAstaAttuale = computed(() => this.asta.tipoAsta() ?? 'classic');

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
  ngOnInit(): void {
    this.onApriSetup();
  }

  protected onApriSetup(): void {
    this.mostraModaleSetup.set(true);
  }

  protected onAnnullaSetup(): void {
    this.mostraModaleSetup.set(false);
  }

  protected onSalvaSetup(config: AstaConfig): void {
    this.asta.avviaAsta(config);
    this.mostraModaleSetup.set(false);
  }

  protected onScarta(): void {
    this.asta.scartaGiocatore();
  }

  protected onAssegna(payload: AssegnazionePayload): void {
    this.asta.assegnaGiocatore(payload.coachId, payload.crediti);
  }

  protected onRimuoviGiocatore(coachId: number, evento: { tipoSlot: TipoSlot; indice: number; rimborsoTotale: boolean }): void {
    this.asta.rimuoviGiocatore(coachId, evento.tipoSlot, evento.indice, evento.rimborsoTotale);
  }

  protected toggleSvincolati(): void {
    this.mostraSvincolati.update((v) => !v);
  }

  protected onEsportaCsv(): void {
    const csv = this.asta.esportaCsv();
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asta-fantacalcio-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // STEP 6c: bottone "Indietro" -> apre la modale di conferma, non naviga subito.
  protected onIndietroClick(): void {
    this.mostraModaleIndietro.set(true);
  }

  protected onBackHome(): void {
    this.mostraModaleIndietro.set(true);
  }

  protected onAnnullaIndietro(): void {
    this.mostraModaleIndietro.set(false);
  }

  // STEP 6d: conferma -> reset esplicito (difensivo, vedi spiegazione) + navigazione via.
  // ATTENZIONE: sostituisci ['/'] con il path reale della tua home se è diverso.
  protected onConfermaIndietro(): void {
    this.asta.reset();
    this.mostraModaleIndietro.set(false);
    this.router.navigate(['/']);
  }
}