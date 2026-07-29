import { Injectable, computed, inject, signal } from '@angular/core';
import { PlayersRepository } from './players-repository.service';
import { AstaConfig, Coach, Player, RosterSlot, SLOT_ALTRI, SLOT_PORTIERI, TeamRoster, TipoAsta, TipoSlot } from '../pages/asta-live/model/player.model';
import { giocaComePortiere, ruoloClassicoDi } from '../pages/asta-live/data/ruoli';

function creaRosterVuoto(coachId: number): TeamRoster {
    return {
        coachId,
        portieri: Array(SLOT_PORTIERI).fill(null),
        altri: Array(SLOT_ALTRI).fill(null),
    };
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
    private readonly playersRepository = inject(PlayersRepository);

    // --- Stato privato -------------------------------------------------
    private readonly _coaches = signal<Coach[]>([]);
    private readonly _codaGiocatori = signal<Player[]>([]);
    private readonly _giocatoreCorrente = signal<Player | null>(null);
    private readonly _svincolati = signal<Player[]>([]);
    private readonly _rosters = signal<Record<number, TeamRoster>>({});
    private readonly _ultimoErrore = signal<string | null>(null);
    private readonly _astaAvviata = signal(false);
    private readonly _dataInizio = signal<number | null>(null);
    private readonly _tipoAsta = signal<TipoAsta | null>(null);
    private readonly _giocatoriTotali = signal(0);

    // --- Stato pubblico in sola lettura ---------------------------------
    readonly coaches = this._coaches.asReadonly();
    readonly giocatoreCorrente = this._giocatoreCorrente.asReadonly();
    readonly svincolati = this._svincolati.asReadonly();
    readonly rosters = this._rosters.asReadonly();
    readonly ultimoErrore = this._ultimoErrore.asReadonly();
    readonly astaAvviata = this._astaAvviata.asReadonly();
    readonly dataInizio = this._dataInizio.asReadonly();
    readonly tipoAsta = this._tipoAsta.asReadonly();
    readonly giocatoriTotali = this._giocatoriTotali.asReadonly();

    readonly giocatoriRimasti = computed(
        () => this._codaGiocatori().length + (this._giocatoreCorrente() ? 1 : 0),
    );
    readonly astaTerminata = computed(
        () => this._astaAvviata() && this._codaGiocatori().length === 0 && this._giocatoreCorrente() === null,
    );

    /** % di giocatori ancora da assegnare/scartare rispetto al totale del mazzo iniziale. */
    readonly percentualeRimanenti = computed(() => {
        const totale = this._giocatoriTotali();
        return totale === 0 ? 0 : (this.giocatoriRimasti() / totale) * 100;
    });

    /** % di svincolati rispetto al totale del mazzo iniziale. */
    readonly percentualeSvincolati = computed(() => {
        const totale = this._giocatoriTotali();
        return totale === 0 ? 0 : (this._svincolati().length / totale) * 100;
    });

    // --- Azioni ----------------------------------------------------------

    /** Configura i fantallenatori/crediti in base alla modale di setup, mescola il mazzo e parte. */
    avviaAsta(config: AstaConfig): void {
        if (this._astaAvviata()) return;

        const coaches: Coach[] = config.nomiPartecipanti.map((nome, i) => ({
            id: i + 1,
            nome,
            creditiResidui: config.creditiBase,
        }));

        this._coaches.set(coaches);
        this._rosters.set(Object.fromEntries(coaches.map((c) => [c.id, creaRosterVuoto(c.id)])));
        this._tipoAsta.set(config.tipo);

        const mescolati = mescola(this.playersRepository.getGiocatori());
        const [primo, ...resto] = mescolati;

        this._giocatoriTotali.set(mescolati.length);
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

    /** Assegna il giocatore corrente a un fantallenatore per un certo numero di crediti. */
    assegnaGiocatore(coachId: number, crediti: number): void {
        const giocatore = this._giocatoreCorrente();
        if (!giocatore) return;

        const rosterAttuale = this._rosters()[coachId];
        const coachAttuale = this._coaches().find((c) => c.id === coachId);
        if (!rosterAttuale || !coachAttuale) return;

        const isPortiere = giocaComePortiere(giocatore);
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

    /** Rimuove un giocatore da una rosa, rimborsa i crediti e lo rimette tra gli svincolati. */
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
     * Genera il CSV con tutte le rose assegnate, in un formato compatibile con l'import
     * su Leghe Fantacalcio (una riga per giocatore, con la fantasquadra per l'abbinamento
     * manuale richiesto dalla piattaforma in fase di caricamento).
     *
     * ATTENZIONE: Leghe Fantacalcio non pubblica uno schema colonne ufficiale verificabile;
     * questo formato è un best-effort basato sugli standard più diffusi. Verifica con un
     * import di prova prima di affidartici per un'asta reale.
     */
    esportaCsv(): string {
        const tipo = this._tipoAsta() ?? 'classic';
        const righe: string[] = ['Squadra Fantacalcio;Ruolo;Nome;Squadra;Costo'];

        for (const coach of this._coaches()) {
            const roster = this._rosters()[coach.id];
            if (!roster) continue;

            const tutti = [...roster.portieri, ...roster.altri].filter(
                (s): s is RosterSlot => s !== null,
            );

            for (const slot of tutti) {
                const ruolo =
                    tipo === 'mantra'
                        ? slot.player.ruoli.map((r) => r.toUpperCase()).join('/')
                        : ruoloClassicoDi(slot.player.ruoli[0]);

                righe.push(
                    `${coach.nome};${ruolo};${slot.player.nome} ${slot.player.cognome};${slot.player.squadra};${slot.crediti}`,
                );
            }
        }

        return righe.join('\n');
    }

    /** Estrae il prossimo giocatore dalla coda; se vuota ma ci sono svincolati, li rimescola. */
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
        this._coaches.set([]);
        this._codaGiocatori.set([]);
        this._giocatoreCorrente.set(null);
        this._svincolati.set([]);
        this._rosters.set({});
        this._ultimoErrore.set(null);
        this._astaAvviata.set(false);
        this._dataInizio.set(null);
        this._tipoAsta.set(null);
        this._giocatoriTotali.set(0);
    }
}