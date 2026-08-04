export type RuoloMantra = 'Por' | 'Dd' | 'Dc' | 'Ds' | 'B' | 'E' | 'M' | 'C' | 'W' | 'T' | 'A' | 'Pc';
export type RuoloClassic = 'POR' | 'DIF' | 'CEN' | 'ATT';

export interface StatisticheGiocatore {
    gol: number;
    assist: number;
    mediaVoto: number;
    fantaMedia: number;
}

export interface GiocatoreRosa {
    id: number;
    nome: string;
    cognome: string;
    ruoloClassic: RuoloClassic;
    ruoliMantra: RuoloMantra[];
    squadraSerieA: string;
    immagineUrl: string;
    /** Crediti attualmente "investiti" su questo giocatore nella rosa fantacalcistica. */
    crediti: number;
    statistiche: StatisticheGiocatore;
}

export interface SquadraFantacalcio {
    id: number;
    nome: string;
    rosa: GiocatoreRosa[];
}

export const MAX_GIOCATORI_PER_LATO = 3;