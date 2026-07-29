export type RuoloMantra = 'Por' | 'Dd' | 'Dc' | 'Ds' | 'B' | 'E' | 'M' | 'C' | 'W' | 'T' | 'A' | 'Pc';
export type RuoloClassic = 'POR' | 'DIF' | 'CEN' | 'ATT';
export type TipoAsta = 'classic' | 'mantra';

export interface Player {
    id: number;
    nome: string;
    cognome: string;
    /** Sempre in formato Mantra (1-3 ruoli granulari); la vista Classic li deriva. */
    ruoli: RuoloMantra[];
    squadra: string;
    nazionalita: string;
    immagineUrl: string;
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

export interface RosterSlot {
    player: Player;
    crediti: number;
}

export type TipoSlot = 'portieri' | 'altri';

export interface TeamRoster {
    coachId: number;
    portieri: (RosterSlot | null)[];
    altri: (RosterSlot | null)[];
}

export interface AstaConfig {
    tipo: TipoAsta;
    creditiBase: number;
    nomiPartecipanti: string[];
}

export const SLOT_PORTIERI = 3;
export const SLOT_ALTRI = 29;
export const SLOT_TOTALI = SLOT_PORTIERI + SLOT_ALTRI;

export const CREDITI_OPZIONI = [250, 500, 1000] as const;
export const PARTECIPANTI_MIN = 8;
export const PARTECIPANTI_MAX = 12;