import { Injectable, computed, signal } from '@angular/core';
import { GiocatoreRosa, MAX_GIOCATORI_PER_LATO, SquadraFantacalcio } from '../pages/components/scambi/model/trade.model';
import { MOCK_SQUADRE } from '../pages/components/asta-live/mock/mock-rose';
import { ripartisciCrediti } from '../pages/components/scambi/data/ruoli-scambi';


function somma(numeri: number[]): number {
    return numeri.reduce((tot, n) => tot + n, 0);
}

export interface RiepilogoScambio {
    squadraSinistra: SquadraFantacalcio;
    squadraDestra: SquadraFantacalcio;
    /** Giocatori ceduti dalla sinistra, con il nuovo costo dopo la ripartizione. */
    cedutiDaSinistra: { giocatore: GiocatoreRosa; nuoviCrediti: number }[];
    /** Giocatori ceduti dalla destra, con il nuovo costo dopo la ripartizione. */
    cedutiDaDestra: { giocatore: GiocatoreRosa; nuoviCrediti: number }[];
}

@Injectable({ providedIn: 'root' })
export class ScambiService {
    private readonly _squadre = signal<SquadraFantacalcio[]>(MOCK_SQUADRE);
    private readonly _squadraSinistraId = signal<number | null>(null);
    private readonly _squadraDestraId = signal<number | null>(null);
    private readonly _cedutiDaSinistra = signal<GiocatoreRosa[]>([]);
    private readonly _cedutiDaDestra = signal<GiocatoreRosa[]>([]);

    readonly squadre = this._squadre.asReadonly();
    readonly cedutiDaSinistra = this._cedutiDaSinistra.asReadonly();
    readonly cedutiDaDestra = this._cedutiDaDestra.asReadonly();
    readonly maxGiocatoriPerLato = MAX_GIOCATORI_PER_LATO;

    readonly squadraSinistra = computed(() => this._squadre().find((s) => s.id === this._squadraSinistraId()) ?? null);
    readonly squadraDestra = computed(() => this._squadre().find((s) => s.id === this._squadraDestraId()) ?? null);

    /** Ogni tendina esclude la squadra già scelta nell'altra: impedisce lo scambio con sé stessa. */
    readonly squadreDisponibiliSinistra = computed(() => this._squadre().filter((s) => s.id !== this._squadraDestraId()));
    readonly squadreDisponibiliDestra = computed(() => this._squadre().filter((s) => s.id !== this._squadraSinistraId()));

    readonly totaleValoreCedutoSinistra = computed(() => somma(this._cedutiDaSinistra().map((g) => g.crediti)));
    readonly totaleValoreCedutoDestra = computed(() => somma(this._cedutiDaDestra().map((g) => g.crediti)));

    readonly scambioValido = computed(
        () => this._cedutiDaSinistra().length > 0 && this._cedutiDaDestra().length > 0,
    );

    selezionaSquadraSinistra(id: number | null): void {
        this._squadraSinistraId.set(id);
        this._cedutiDaSinistra.set([]); // cambiare squadra annulla le selezioni già fatte su quel lato
    }

    selezionaSquadraDestra(id: number | null): void {
        this._squadraDestraId.set(id);
        this._cedutiDaDestra.set([]);
    }

    /** Toggle: se il giocatore è già selezionato lo rimuove, altrimenti lo aggiunge (max 3). */
    toggleGiocatoreSinistra(giocatore: GiocatoreRosa): void {
        this._cedutiDaSinistra.update((lista) => {
            const presente = lista.some((g) => g.id === giocatore.id);
            if (presente) return lista.filter((g) => g.id !== giocatore.id);
            if (lista.length >= MAX_GIOCATORI_PER_LATO) return lista;
            return [...lista, giocatore];
        });
    }

    toggleGiocatoreDestra(giocatore: GiocatoreRosa): void {
        this._cedutiDaDestra.update((lista) => {
            const presente = lista.some((g) => g.id === giocatore.id);
            if (presente) return lista.filter((g) => g.id !== giocatore.id);
            if (lista.length >= MAX_GIOCATORI_PER_LATO) return lista;
            return [...lista, giocatore];
        });
    }

    /** Bottone "Annulla scambio": azzera i giocatori coinvolti, non tocca le squadre scelte. */
    annullaScambio(): void {
        this._cedutiDaSinistra.set([]);
        this._cedutiDaDestra.set([]);
    }

    /**
     * Calcola la ripartizione crediti per entrambi i lati e prepara i dati per la modale
     * di riepilogo. Il valore ceduto da un lato finanzia i giocatori che quel lato riceve.
     */
    costruisciRiepilogo(): RiepilogoScambio | null {
        const sinistra = this.squadraSinistra();
        const destra = this.squadraDestra();
        if (!sinistra || !destra || !this.scambioValido()) return null;

        // I giocatori ceduti dalla sinistra arrivano alla destra, finanziati da ciò che la destra ha ceduto.
        const nuoviCreditiArrivoDestra = ripartisciCrediti(this._cedutiDaSinistra(), this.totaleValoreCedutoDestra());
        // Simmetricamente per la sinistra.
        const nuoviCreditiArrivoSinistra = ripartisciCrediti(this._cedutiDaDestra(), this.totaleValoreCedutoSinistra());

        return {
            squadraSinistra: sinistra,
            squadraDestra: destra,
            cedutiDaSinistra: this._cedutiDaSinistra().map((g) => ({
                giocatore: g,
                nuoviCrediti: nuoviCreditiArrivoDestra.get(g.id) ?? g.crediti,
            })),
            cedutiDaDestra: this._cedutiDaDestra().map((g) => ({
                giocatore: g,
                nuoviCrediti: nuoviCreditiArrivoSinistra.get(g.id) ?? g.crediti,
            })),
        };
    }

    /**
     * Chiamata al BE che finalizza lo scambio. MOCKATA: nessun endpoint reale esiste ancora.
     * Endpoint reale suggerito: POST /api/v1/leghe/{legaId}/scambi
     *   body: { squadraSinistraId, squadraDestraId, cedutiDaSinistra: [...], cedutiDaDestra: [...] }
     * Ritorna già una Promise per essere pronta a diventare un vero HttpClient.post(...).
     */
    async confermaScambio(riepilogo: RiepilogoScambio): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 700)); // simula latenza di rete

        this._squadre.update((squadre) =>
            squadre.map((squadra) => {
                if (squadra.id === riepilogo.squadraSinistra.id) {
                    const rosaSenzaCeduti = squadra.rosa.filter(
                        (g) => !riepilogo.cedutiDaSinistra.some((c) => c.giocatore.id === g.id),
                    );
                    const arrivati = riepilogo.cedutiDaDestra.map((c) => ({ ...c.giocatore, crediti: c.nuoviCrediti }));
                    return { ...squadra, rosa: [...rosaSenzaCeduti, ...arrivati] };
                }
                if (squadra.id === riepilogo.squadraDestra.id) {
                    const rosaSenzaCeduti = squadra.rosa.filter(
                        (g) => !riepilogo.cedutiDaDestra.some((c) => c.giocatore.id === g.id),
                    );
                    const arrivati = riepilogo.cedutiDaSinistra.map((c) => ({ ...c.giocatore, crediti: c.nuoviCrediti }));
                    return { ...squadra, rosa: [...rosaSenzaCeduti, ...arrivati] };
                }
                return squadra;
            }),
        );

        this.annullaScambio();
    }
}