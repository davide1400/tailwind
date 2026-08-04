import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Bottone "Indietro" riutilizzabile in qualunque pagina. Due modalità:
 * - senza confirmMessage: naviga subito verso homeRoute;
 * - con confirmMessage: mostra prima una modale di conferma con quel testo (utile
 *   quando uscire comporta perdita di dati, es. un'asta in corso).
 */
@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  private readonly router = inject(Router);

  homeRoute = input('/');
  confirmMessage = input<string | null>(null);

  /** Emesso subito prima di navigare: il genitore può usarlo per fare pulizia
   *  (es. resettare uno stato scoped) prima di lasciare la pagina. */
  primaDiUscire = output<void>();

  protected readonly mostraModale = signal(false);

  protected onClick(): void {
    if (this.confirmMessage()) {
      this.mostraModale.set(true);
    } else {
      this.naviga();
    }
  }

  protected onAnnulla(): void {
    this.mostraModale.set(false);
  }

  protected onConferma(): void {
    this.mostraModale.set(false);
    this.naviga();
  }

  private naviga(): void {
    this.primaDiUscire.emit();
    this.router.navigate([this.homeRoute()]);
  }
}
