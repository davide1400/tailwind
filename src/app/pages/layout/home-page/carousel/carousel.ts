import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselService } from './service/carousel-service';

const NOTIZIE_PER_PAGINA = 3;

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  protected readonly servizio = inject(CarouselService);

  protected readonly pagina = signal(0);

  protected readonly totalePagine = computed(() =>
    Math.max(1, Math.ceil(this.servizio.numeroNotizie() / NOTIZIE_PER_PAGINA)),
  );

  protected readonly indicatorePagine = computed (() => 
    Array.from(
      {length: this.totalePagine() },
      (_, index) => index
    )
  )

  /** Le sole 3 notizie da mostrare per la pagina corrente. */
  protected readonly notizieVisibili = computed(() => {
    const inizio = this.pagina() * NOTIZIE_PER_PAGINA;
    return this.servizio.notizie().slice(inizio, inizio + NOTIZIE_PER_PAGINA);
  });

  protected readonly puoAndareAvanti = computed(() => this.totalePagine() > 1);
  protected readonly puoAndareIndietro = computed(() => this.totalePagine() > 1);

  /** Avanti/indietro con "giro" circolare: dall'ultima pagina si torna alla prima e viceversa. */
  protected onAvanti(): void {
    this.pagina.update((p) => (p + 1) % this.totalePagine());
  }

  protected onIndietro(): void {
    this.pagina.update((p) => (p - 1 + this.totalePagine()) % this.totalePagine());
  }

  protected formattaData(iso: string): string {
    return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}