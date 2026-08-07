import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Un singolo articolo di notizia, nel formato che usiamo internamente nel FE. */
export interface Notizia {
  titolo: string;
  descrizione: string;
  url: string;
  immagineUrl: string | null;
  fonte: string;
  pubblicatoIl: string; // ISO date string
}

/** Forma della risposta JSON restituita da GNews (solo i campi che ci interessano). */
interface GNewsArticolo {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: { name: string; url: string };
}

interface GNewsRisposta {
  totalArticles: number;
  articles: GNewsArticolo[];
}

// TODO: sposta questa chiave in un file di environment (src/environments/environment.ts)
// quando lo avrai strutturato: es. `token: environment.gnewsApiKey`. Tenerla qui va bene
// solo per sviluppo locale — non committarla in un repo pubblico.
const GNEWS_API_KEY = 'INSERISCI_QUI_LA_TUA_API_KEY';
const GNEWS_ENDPOINT = 'https://gnews.io/api/v4/search';

@Injectable({ providedIn: 'root' })
export class CarouselService {
  private readonly http = inject(HttpClient);

  private readonly _notizie = signal<Notizia[]>([]);
  private readonly _caricamento = signal(true);
  private readonly _errore = signal<string | null>(null);

  readonly notizie = this._notizie.asReadonly();
  readonly caricamento = this._caricamento.asReadonly();
  readonly errore = this._errore.asReadonly();

  readonly numeroNotizie = computed(() => this._notizie().length);

  constructor() {
    this.caricaNotizie();
  }

  /**
   * Interroga GNews per notizie di calciomercato/formazioni in italiano.
   * Endpoint reale: GET https://gnews.io/api/v4/search
   *   ?q=calciomercato+OR+formazioni  -> parole chiave della ricerca
   *   &lang=it&country=it             -> solo fonti/lingua italiana
   *   &sortby=publishedAt             -> le più recenti prima
   *   &max=10                         -> massimo consentito dal piano free
   *   &token=<API_KEY>
   */
  private caricaNotizie(): void {
    this._caricamento.set(true);
    this._errore.set(null);

    const parametri = new URLSearchParams({
      q: 'calciomercato OR formazioni OR Serie A',
      lang: 'it',
      country: 'it',
      sortby: 'publishedAt',
      max: '10',
      token: GNEWS_API_KEY,
    });

    this.http.get<GNewsRisposta>(`${GNEWS_ENDPOINT}?${parametri.toString()}`).subscribe({
      next: (risposta) => {
        this._notizie.set(
          risposta.articles.map((a) => ({
            titolo: a.title,
            descrizione: a.description,
            url: a.url,
            immagineUrl: a.image,
            fonte: a.source.name,
            pubblicatoIl: a.publishedAt,
          })),
        );
        this._caricamento.set(false);
      },
      error: () => {
        this._errore.set('Impossibile caricare le notizie in questo momento.');
        this._caricamento.set(false);
      },
    });
  }

  /** Utile per un eventuale bottone "aggiorna" nel carousel. */
  ricarica(): void {
    this.caricaNotizie();
  }
}