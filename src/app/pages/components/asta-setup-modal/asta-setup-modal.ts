import { Component, computed, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AstaConfig, CREDITI_OPZIONI, PARTECIPANTI_MAX, PARTECIPANTI_MIN, TipoAsta } from '../asta-live/model/player.model';


type Step = 1 | 2 | 3;

@Component({
  selector: 'app-asta-setup-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asta-setup-modal.html',
  styleUrl: './asta-setup-modal.css',
})
export class AstaSetupModal {
  salva = output<AstaConfig>();
  backHome = output<void>();

  protected readonly creditiOpzioni = CREDITI_OPZIONI;
  protected readonly partecipantiMin = PARTECIPANTI_MIN;
  protected readonly partecipantiMax = PARTECIPANTI_MAX;

  protected readonly step = signal<Step>(1);
  protected readonly tipoAsta = signal<TipoAsta | null>(null);
  protected readonly creditiBase = signal<number | null>(null);
  protected readonly numeroPartecipanti = signal(12);
  protected readonly nomiPartecipanti = signal<string[]>(Array(12).fill(''));

  protected readonly step1Valido = computed(() => this.tipoAsta() !== null);
  protected readonly step2Valido = computed(() => this.creditiBase() !== null);
  protected readonly step3Valido = computed(() => this.nomiPartecipanti().every((n) => n.trim().length > 0));

  protected onScegliTipo(tipo: TipoAsta): void {
    this.tipoAsta.set(tipo);
  }

  protected onScegliCrediti(valore: number): void {
    this.creditiBase.set(valore);
  }

  protected onNumeroPartecipantiChange(delta: number): void {
    const nuovo = Math.min(this.partecipantiMax, Math.max(this.partecipantiMin, this.numeroPartecipanti() + delta));
    this.numeroPartecipanti.set(nuovo);
    this.nomiPartecipanti.update((nomi) => {
      const copia = [...nomi];
      if (nuovo > copia.length) {
        while (copia.length < nuovo) copia.push('');
      } else {
        copia.length = nuovo;
      }
      return copia;
    });
  }

  protected onNomeChange(indice: number, event: Event): void {
    const valore = (event.target as HTMLInputElement).value;
    this.nomiPartecipanti.update((nomi) => {
      const copia = [...nomi];
      copia[indice] = valore;
      return copia;
    });
  }

  protected onAvanti(): void {
    if (this.step() === 1 && this.step1Valido()) this.step.set(2);
    else if (this.step() === 2 && this.step2Valido()) this.step.set(3);
  }

  protected onIndietro(): void {
    if (this.step() === 2) this.step.set(1);
    else if (this.step() === 3) this.step.set(2);
  }

  protected onBackHome(): void {
    this.backHome.emit();
  }

  protected onSalva(): void {
    if (!this.step3Valido()) return;
    const tipo = this.tipoAsta();
    const crediti = this.creditiBase();
    if (!tipo || crediti === null) return;

    this.salva.emit({
      tipo,
      creditiBase: crediti,
      nomiPartecipanti: this.nomiPartecipanti().map((n) => n.trim()),
    });
  }
}