import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiepilogoScambio } from '../../../../../service/scambi.service';


@Component({
  selector: 'app-trade-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-confirm-modal.html',
  styleUrl: './trade-confirm-modal.css',
})
export class TradeConfirmModal {
  riepilogo = input.required<RiepilogoScambio>();
  caricamento = input(false);

  conferma = output<void>();
  annulla = output<void>();

  protected onBackdropClick(): void {
    if (!this.caricamento()) {
      this.annulla.emit();
    }
  }

  /**
   * STEP 5: somma dei crediti effettivamente spostati in questo scambio (entrambe le
   * direzioni). Usata per la chip di evidenza in alto nella modale.
   */
  protected totaleCreditiScambio(): number {
    const r = this.riepilogo();
    const totaleVersoSinistra = r.cedutiDaDestra.reduce((s, v) => s + v.nuoviCrediti, 0);
    const totaleVersoDestra = r.cedutiDaSinistra.reduce((s, v) => s + v.nuoviCrediti, 0);
    return totaleVersoSinistra + totaleVersoDestra;
  }
}