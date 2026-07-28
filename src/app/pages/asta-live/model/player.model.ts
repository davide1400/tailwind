export type Ruolo = 'POR' | 'DIF' | 'CEN' | 'ATT';
export type TipoSlot = 'portieri' | 'altri';

export interface Player {
    id: number;
    nome: string;
    cognome: string;
    ruolo: Ruolo;
    squadra?: string;
}

export interface Coach {
    id: number;
    nome: string;
    creditiResidui: number;
}

export interface AssegnazionePayload {
    coachId: number;
    crediti: number;
}

/** Uno slot occupato tiene sia il giocatore che i crediti effettivamente spesi. */
export interface RosterSlot {
    player: Player;
    crediti: number;
}

export interface TeamRoster {
    coachId: number;
    portieri: (RosterSlot | null)[];
    altri: (RosterSlot | null)[];
}

export const SLOT_PORTIERI = 3;
export const SLOT_ALTRI = 29;
export const SLOT_TOTALI = SLOT_PORTIERI + SLOT_ALTRI;
export const CREDITI_INIZIALI = 1000;