import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { AssegnazionePayload, Coach, Player, Ruolo } from '../model/player.model';

interface RuoloConfig {
  label: string;
  badge: string;
  glow: string;
}

const RUOLO_CONFIG: Record<Ruolo, RuoloConfig> = {
  POR: { label: 'Portiere', badge: 'bg-amber-400 text-amber-950', glow: 'shadow-amber-400/40' },
  DIF: { label: 'Difensore', badge: 'bg-sky-500 text-sky-50', glow: 'shadow-sky-500/40' },
  CEN: { label: 'Centrocampista', badge: 'bg-emerald-500 text-emerald-50', glow: 'shadow-emerald-500/40' },
  ATT: { label: 'Attaccante', badge: 'bg-rose-600 text-rose-50', glow: 'shadow-rose-600/40' },
};

type Fase = 'iniziale' | 'scegli-squadra' | 'inserisci-crediti';


@Component({
  selector: 'app-player-card',
  imports: [CommonModule],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css',
})

export class PlayerCard {
  
  giocatore = input.required<Player>();
  coaches = input.required<Coach[]>();
  errore = input<string | null>(null);

  scarta = output<void>();
  assegna = output<AssegnazionePayload>();

  protected readonly ruoloConfig = RUOLO_CONFIG;
  protected readonly fase = signal<Fase>('iniziale');
  protected readonly squadraSelezionata = signal<Coach | null>(null);
  protected readonly creditiInseriti = signal<number | null>(null);

  protected readonly erroreCrediti = computed(() => {
    const squadra = this.squadraSelezionata();
    const crediti = this.creditiInseriti();
    if (!squadra || crediti === null || Number.isNaN(crediti)) return null;
    if (crediti < 0 || !Number.isInteger(crediti)) return 'Inserisci un numero intero valido.';
    if (crediti > squadra.creditiResidui) return `Crediti insufficienti (residuo ${squadra.creditiResidui}).`;
    return null;
  });

  protected readonly confermaAbilitata = computed(
    () => this.creditiInseriti() !== null && !this.erroreCrediti(),
  );

  constructor() {
    // ogni volta che cambia il giocatore estratto, riparti da zero con la selezione
    effect(() => {
      this.giocatore();
      this.fase.set('iniziale');
      this.squadraSelezionata.set(null);
      this.creditiInseriti.set(null);
    });
  }

  protected onScartaClick(): void {
    this.scarta.emit();
  }

  protected onAssegnaClick(): void {
    this.fase.set('scegli-squadra');
  }

  protected onAnnullaSelezioneSquadra(): void {
    this.fase.set('iniziale');
  }

  protected onSelezionaSquadra(coach: Coach): void {
    this.squadraSelezionata.set(coach);
    this.creditiInseriti.set(null);
    this.fase.set('inserisci-crediti');
  }

  protected onAnnullaCrediti(): void {
    this.squadraSelezionata.set(null);
    this.fase.set('scegli-squadra');
  }

  protected onCreditiChange(event: Event): void {
    const valore = (event.target as HTMLInputElement).valueAsNumber;
    this.creditiInseriti.set(Number.isNaN(valore) ? null : valore);
  }

  protected onConfermaAssegnazione(): void {
    const squadra = this.squadraSelezionata();
    const crediti = this.creditiInseriti();
    if (!squadra || crediti === null || this.erroreCrediti()) return;

    this.assegna.emit({ coachId: squadra.id, crediti });
  }

}
