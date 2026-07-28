import { Injectable, computed, signal } from '@angular/core';
import { Coach, CREDITI_INIZIALI, Player, SLOT_ALTRI, SLOT_PORTIERI, TeamRoster, TipoSlot } from '../pages/asta-live/model/player.model';
import { MOCK_PLAYERS } from '../pages/asta-live/mock/mock-player';


const NUMERO_FANTALLENATORI = 12;

function creaRosterVuoto(coachId: number): TeamRoster {
    return {
        coachId,
        portieri: Array(SLOT_PORTIERI).fill(null),
        altri: Array(SLOT_ALTRI).fill(null),
    };
}

function creaFantallenatori(): Coach[] {
    return Array.from({ length: NUMERO_FANTALLENATORI }, (_, i) => ({
        id: i + 1,
        nome: `Fantallenatore ${i + 1}`,
        creditiResidui: CREDITI_INIZIALI,
    }));
}

/** Fisher-Yates: mescola un array senza mutare l'originale. */
function mescola<T>(array: T[]): T[] {
    const risultato = [...array];
    for (let i = risultato.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [risultato[i], risultato[j]] = [risultato[j], risultato[i]];
    }
    return risultato;
}

@Injectable({ providedIn: 'root' })
export class AstaService {
    // --- Stato privato -------------------------------------------------
    private readonly _coaches = signal<Coach[]>(creaFantallenatori());
    private readonly _codaGiocatori = signal<Player[]>([]);
    private readonly _giocatoreCorrente = signal<Player | null>(null);
    private readonly _svincolati = signal<Player[]>([]);
    private readonly _rosters = signal<Record<number, TeamRoster>>(
        Object.fromEntries(creaFantallenatori().map((c) => [c.id, creaRosterVuoto(c.id)])),
    );
    private readonly _ultimoErrore = signal<string | null>(null);
    private readonly _astaAvviata = signal(false);
    private readonly _dataInizio = signal<number | null>(null);

    // --- Stato pubblico in sola lettura ---------------------------------
    readonly coaches = this._coaches.asReadonly();
    readonly giocatoreCorrente = this._giocatoreCorrente.asReadonly();
    readonly svincolati = this._svincolati.asReadonly();
    readonly rosters = this._rosters.asReadonly();
    readonly ultimoErrore = this._ultimoErrore.asReadonly();
    readonly astaAvviata = this._astaAvviata.asReadonly();
    readonly dataInizio = this._dataInizio.asReadonly();

    readonly giocatoriRimasti = computed(
        () => this._codaGiocatori().length + (this._giocatoreCorrente() ? 1 : 0),
    );
    readonly astaTerminata = computed(
        () => this._astaAvviata() && this._codaGiocatori().length === 0 && this._giocatoreCorrente() === null,
    );

    // --- Azioni ----------------------------------------------------------

    /** Mescola tutti i giocatori, estrae il primo e fa partire il cronometro. */
    avviaAsta(): void {
        if (this._astaAvviata()) return;

        const mescolati = mescola(MOCK_PLAYERS);
        const [primo, ...resto] = mescolati;

        this._codaGiocatori.set(resto);
        this._giocatoreCorrente.set(primo ?? null);
        this._astaAvviata.set(true);
        this._dataInizio.set(Date.now());
        this._ultimoErrore.set(null);
    }

    /** Manda il giocatore corrente tra gli svincolati e passa al successivo. */
    scartaGiocatore(): void {
        const giocatore = this._giocatoreCorrente();
        if (!giocatore) return;

        this._svincolati.update((lista) => [...lista, giocatore]);
        this._ultimoErrore.set(null);
        this.avanzaProssimo();
    }

    /**
     * Assegna il giocatore corrente al fantallenatore scelto per un certo numero di crediti,
     * scala il residuo e passa in automatico al giocatore successivo.
     */
    assegnaGiocatore(coachId: number, crediti: number): void {
        const giocatore = this._giocatoreCorrente();
        if (!giocatore) return;

        const rosterAttuale = this._rosters()[coachId];
        const coachAttuale = this._coaches().find((c) => c.id === coachId);
        if (!rosterAttuale || !coachAttuale) return;

        const isPortiere = giocatore.ruolo === 'POR';
        const slotAttuali = isPortiere ? rosterAttuale.portieri : rosterAttuale.altri;
        const indiceLibero = slotAttuali.findIndex((slot) => slot === null);

        if (indiceLibero === -1) {
            this._ultimoErrore.set(
                isPortiere
                    ? 'Slot portieri esauriti per questa squadra (3/3).'
                    : `Rosa completa per questa squadra (${SLOT_ALTRI}/${SLOT_ALTRI}).`,
            );
            return;
        }

        if (!Number.isInteger(crediti) || crediti < 0) {
            this._ultimoErrore.set('Inserisci un numero di crediti valido.');
            return;
        }

        if (crediti > coachAttuale.creditiResidui) {
            this._ultimoErrore.set(
                `Crediti insufficienti: residuo ${coachAttuale.creditiResidui}, richiesti ${crediti}.`,
            );
            return;
        }

        this._rosters.update((rosters) => {
            const roster = rosters[coachId];
            const nuoviSlot = [...slotAttuali];
            nuoviSlot[indiceLibero] = { player: giocatore, crediti };

            const rosterAggiornato: TeamRoster = isPortiere
                ? { ...roster, portieri: nuoviSlot }
                : { ...roster, altri: nuoviSlot };

            return { ...rosters, [coachId]: rosterAggiornato };
        });

        this._coaches.update((coaches) =>
            coaches.map((c) => (c.id === coachId ? { ...c, creditiResidui: c.creditiResidui - crediti } : c)),
        );

        this._ultimoErrore.set(null);
        this.avanzaProssimo();
    }

    /**
     * Rimuove un giocatore da una rosa: libera lo slot, rimborsa i crediti (totali o metà per
     * difetto) e rimette il giocatore tra gli svincolati.
     */
    rimuoviGiocatore(coachId: number, tipoSlot: TipoSlot, indice: number, rimborsoTotale: boolean): void {
        const roster = this._rosters()[coachId];
        const coach = this._coaches().find((c) => c.id === coachId);
        if (!roster || !coach) return;

        const slots = tipoSlot === 'portieri' ? roster.portieri : roster.altri;
        const slot = slots[indice];
        if (!slot) return;

        const rimborso = rimborsoTotale ? slot.crediti : Math.floor(slot.crediti / 2);

        this._rosters.update((rosters) => {
            const r = rosters[coachId];
            const nuoviSlot = [...(tipoSlot === 'portieri' ? r.portieri : r.altri)];
            nuoviSlot[indice] = null;

            const aggiornato: TeamRoster =
                tipoSlot === 'portieri' ? { ...r, portieri: nuoviSlot } : { ...r, altri: nuoviSlot };

            return { ...rosters, [coachId]: aggiornato };
        });

        this._coaches.update((coaches) =>
            coaches.map((c) => (c.id === coachId ? { ...c, creditiResidui: c.creditiResidui + rimborso } : c)),
        );

        this._svincolati.update((lista) => [...lista, slot.player]);
    }

    /**
     * Estrae il prossimo giocatore dalla coda. Se la coda è vuota ma ci sono svincolati,
     * li rimette in gioco rimescolandoli prima di continuare (fine "giro" dell'asta).
     */
    private avanzaProssimo(): void {
        let coda = this._codaGiocatori();

        if (coda.length === 0) {
            const svincolati = this._svincolati();
            if (svincolati.length > 0) {
                coda = mescola(svincolati);
                this._svincolati.set([]);
            }
        }

        if (coda.length === 0) {
            this._codaGiocatori.set([]);
            this._giocatoreCorrente.set(null);
            return;
        }

        const [prossimo, ...resto] = coda;
        this._codaGiocatori.set(resto);
        this._giocatoreCorrente.set(prossimo);
    }

    /** Utile per un pulsante "reset asta" o per test manuali. */
    reset(): void {
        this._coaches.set(creaFantallenatori());
        this._codaGiocatori.set([]);
        this._giocatoreCorrente.set(null);
        this._svincolati.set([]);
        this._rosters.set(Object.fromEntries(this._coaches().map((c) => [c.id, creaRosterVuoto(c.id)])));
        this._ultimoErrore.set(null);
        this._astaAvviata.set(false);
        this._dataInizio.set(null);
    }
}