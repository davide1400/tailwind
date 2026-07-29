import { Player, RuoloClassic, RuoloMantra, TipoAsta } from "../model/player.model";

export interface RuoloInfo {
    label: string;
    badge: string; // sfondo + testo, per i chip
    testo: string; // solo colore testo, per riferimenti compatti (es. tabelle)
}

export interface ChipRuolo {
    codice: string;
    badge: string;
    testo: string;
}

/** Colori Mantra: Por=giallo · Dd/Dc/Ds/B=verde · E/M/C=blu · W/T=viola · A/Pc=rosso */
export const RUOLI_MANTRA_INFO: Record<RuoloMantra, RuoloInfo> = {
    Por: { label: 'Portiere', badge: 'bg-amber-400 text-amber-950', testo: 'text-amber-400' },
    Dd: { label: 'Difensore Destro', badge: 'bg-emerald-500 text-emerald-50', testo: 'text-emerald-400' },
    Dc: { label: 'Difensore Centrale', badge: 'bg-emerald-500 text-emerald-50', testo: 'text-emerald-400' },
    Ds: { label: 'Difensore Sinistro', badge: 'bg-emerald-500 text-emerald-50', testo: 'text-emerald-400' },
    B: { label: 'Braccetto', badge: 'bg-emerald-500 text-emerald-50', testo: 'text-emerald-400' },
    E: { label: 'Esterno', badge: 'bg-blue-500 text-blue-50', testo: 'text-blue-400' },
    M: { label: 'Mediano', badge: 'bg-blue-500 text-blue-50', testo: 'text-blue-400' },
    C: { label: 'Centrocampista', badge: 'bg-blue-500 text-blue-50', testo: 'text-blue-400' },
    W: { label: 'Ala', badge: 'bg-violet-500 text-violet-50', testo: 'text-violet-400' },
    T: { label: 'Trequartista', badge: 'bg-violet-500 text-violet-50', testo: 'text-violet-400' },
    A: { label: 'Attaccante', badge: 'bg-rose-600 text-rose-50', testo: 'text-rose-400' },
    Pc: { label: 'Prima Punta', badge: 'bg-rose-600 text-rose-50', testo: 'text-rose-400' },
};

/** Colori Classic: Portiere=giallo · Difensore=verde · Centrocampista=blu · Attaccante=rosso */
export const RUOLI_CLASSIC_INFO: Record<RuoloClassic, RuoloInfo> = {
    POR: { label: 'Portiere', badge: 'bg-amber-400 text-amber-950', testo: 'text-amber-400' },
    DIF: { label: 'Difensore', badge: 'bg-emerald-500 text-emerald-50', testo: 'text-emerald-400' },
    CEN: { label: 'Centrocampista', badge: 'bg-blue-500 text-blue-50', testo: 'text-blue-400' },
    ATT: { label: 'Attaccante', badge: 'bg-rose-600 text-rose-50', testo: 'text-rose-400' },
};

/** Mappatura reale Fantacalcio Mantra -> Classic, usata quando si gioca in modalità Classic. */
const MAPPA_CLASSIC: Record<RuoloMantra, RuoloClassic> = {
    Por: 'POR',
    Dd: 'DIF',
    Dc: 'DIF',
    Ds: 'DIF',
    B: 'DIF',
    E: 'CEN',
    M: 'CEN',
    C: 'CEN',
    W: 'CEN',
    T: 'CEN',
    A: 'ATT',
    Pc: 'ATT',
};

export function ruoloClassicoDi(ruolo: RuoloMantra): RuoloClassic {
    return MAPPA_CLASSIC[ruolo];
}

/** Determina se un giocatore va negli slot "portieri" indipendentemente dalla modalità. */
export function giocaComePortiere(giocatore: Player): boolean {
    return giocatore.ruoli.includes('Por');
}

/** Chip da mostrare nella card: ruoli Mantra reali, oppure il singolo ruolo Classic derivato. */
export function getChipsRuolo(giocatore: Player, tipoAsta: TipoAsta): ChipRuolo[] {
    if (tipoAsta === 'mantra') {
        return giocatore.ruoli.map((r) => ({ codice: r.toUpperCase(), ...RUOLI_MANTRA_INFO[r] }));
    }

    const classiciUnici = Array.from(new Set(giocatore.ruoli.map(ruoloClassicoDi)));
    return classiciUnici.map((r) => ({ codice: r, ...RUOLI_CLASSIC_INFO[r] }));
}

/** Testo compatto "DD/DC" o "DIF" per le righe di tabella, con colore del ruolo principale. */
export function getRuoloCompatto(giocatore: Player, tipoAsta: TipoAsta): { testo: string; colore: string } {
    const chips = getChipsRuolo(giocatore, tipoAsta);
    return {
        testo: chips.map((c) => c.codice).join('/'),
        colore: chips[0]?.testo ?? 'text-zinc-400',
    };
}