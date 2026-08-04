import { GiocatoreRosa, RuoloMantra } from "../../scambi/model/trade.model";

interface RuoloInfo {
    badge: string;
}

/** Colori chip ruolo: convenzione fissa, indipendente dal tema pagina. Invariato. */
export const RUOLI_INFO: Record<RuoloMantra, RuoloInfo> = {
    Por: { badge: 'bg-amber-400 text-amber-950' },
    Dd: { badge: 'bg-emerald-500 text-emerald-50' },
    Dc: { badge: 'bg-emerald-500 text-emerald-50' },
    Ds: { badge: 'bg-emerald-500 text-emerald-50' },
    B: { badge: 'bg-emerald-500 text-emerald-50' },
    E: { badge: 'bg-blue-500 text-blue-50' },
    M: { badge: 'bg-blue-500 text-blue-50' },
    C: { badge: 'bg-blue-500 text-blue-50' },
    W: { badge: 'bg-violet-500 text-violet-50' },
    T: { badge: 'bg-violet-500 text-violet-50' },
    A: { badge: 'bg-rose-600 text-rose-50' },
    Pc: { badge: 'bg-rose-600 text-rose-50' },
};

/**
 * STEP 1: la ripartizione NON dipende più dal ruolo. Ordino i giocatori in arrivo dal
 * valore attuale (crediti) più alto al più basso: chi "valeva di più" prima dello scambio
 * riceve la quota maggiore della cifra totale da ripartire. Con un solo giocatore in
 * arrivo prende comunque il 100% (n=1 -> peso unico), quindi la stessa funzione gestisce
 * senza rami speciali sia lo scambio 1 a 1 che quello N a M.
 */
export function ripartisciCrediti(giocatoriInArrivo: GiocatoreRosa[], totale: number): Map<number, number> {
    const ordinati = [...giocatoriInArrivo].sort((a, b) => b.crediti - a.crediti);
    const n = ordinati.length;
    if (n === 0) return new Map();

    const pesi = ordinati.map((_, i) => n - i); // n, n-1, ..., 1
    const sommaPesi = pesi.reduce((s, p) => s + p, 0);

    const risultato = new Map<number, number>();
    let assegnati = 0;

    ordinati.forEach((giocatore, i) => {
        // L'ultimo (il meno pagato) assorbe il resto di arrotondamento, così la somma
        // delle quote coincide sempre esattamente con "totale".
        const quota = i === n - 1 ? totale - assegnati : Math.round((totale * pesi[i]) / sommaPesi);
        risultato.set(giocatore.id, quota);
        assegnati += quota;
    });

    return risultato;
}