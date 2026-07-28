import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Coach,
  Ruolo,
  RosterSlot,
  SLOT_ALTRI,
  SLOT_PORTIERI,
  SLOT_TOTALI,
  TeamRoster,
  TipoSlot,
} from '../model/player.model';

const COLORE_RUOLO: Record<Ruolo, string> = {
  POR: 'text-amber-400',
  DIF: 'text-sky-500',
  CEN: 'text-emerald-500',
  ATT: 'text-rose-500',
};

interface RichiestaRimozione {
  tipoSlot: TipoSlot;
  indice: number;
  slot: RosterSlot;
}

@Component({
  selector: 'app-team-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-table.html',
  styleUrl: './team-table.css',
})
export class TeamTable {
  coach = input.required<Coach>();
  roster = input.required<TeamRoster>();

  rimuoviGiocatore = output<{ tipoSlot: TipoSlot; indice: number; rimborsoTotale: boolean }>();

  protected readonly slotTotali = SLOT_TOTALI;
  protected readonly slotPortieri = SLOT_PORTIERI;
  protected readonly slotAltri = SLOT_ALTRI;
  protected readonly coloreRuolo = COLORE_RUOLO;

  protected readonly richiestaRimozione = signal<RichiestaRimozione | null>(null);
  protected readonly rimborsoScelto = signal<'totale' | 'meta'>('totale');

  protected readonly totaleAssegnati = computed(() => {
    const r = this.roster();
    const portieriOccupati = r.portieri.filter((p) => p !== null).length;
    const altriOccupati = r.altri.filter((p) => p !== null).length;
    return portieriOccupati + altriOccupati;
  });

  protected readonly rosaCompleta = computed(() => this.totaleAssegnati() === this.slotTotali);

  protected readonly rimborsoMeta = computed(() => {
    const richiesta = this.richiestaRimozione();
    return richiesta ? Math.floor(richiesta.slot.crediti / 2) : 0;
  });

  protected apriModaleRimozione(tipoSlot: TipoSlot, indice: number, slot: RosterSlot | null): void {
    if (!slot) return;
    this.richiestaRimozione.set({ tipoSlot, indice, slot });
    this.rimborsoScelto.set('totale');
  }

  protected chiudiModale(): void {
    this.richiestaRimozione.set(null);
  }

  protected confermaRimozione(): void {
    const richiesta = this.richiestaRimozione();
    if (!richiesta) return;

    this.rimuoviGiocatore.emit({
      tipoSlot: richiesta.tipoSlot,
      indice: richiesta.indice,
      rimborsoTotale: this.rimborsoScelto() === 'totale',
    });
    this.chiudiModale();
  }
}