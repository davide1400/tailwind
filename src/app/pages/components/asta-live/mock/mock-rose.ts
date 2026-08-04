
import { GiocatoreRosa, SquadraFantacalcio } from "../../scambi/model/trade.model";
import { RuoloClassic, RuoloMantra } from "../model/player.model";

/**
 * ATTENZIONE: dati completamente fittizi (nomi, statistiche, crediti) generati in modo
 * deterministico solo per la demo. Rappresentano lo stato "a fine asta" di una lega, che
 * in produzione arriverà dal BE Java Spring Boot / MySQL.
 * Endpoint reale suggerito: GET /api/v1/leghe/{legaId}/rose -> SquadraFantacalcio[]
 */

const NOMI = ['Marco', 'Luca', 'Davide', 'Simone', 'Andrea', 'Federico', 'Alessio', 'Matteo', 'Gabriele', 'Riccardo', 'Tommaso', 'Nicola', 'Giacomo', 'Filippo', 'Emanuele', 'Christian', 'Leonardo', 'Samuele', 'Cristian', 'Diego', 'Manuel', 'Stefano', 'Michele', 'Antonio', 'Giulio', 'Alberto', 'Vincenzo', 'Salvatore', 'Lorenzo', 'Raffaele', 'Enrico', 'Pietro', 'Jacopo', 'Edoardo', 'Gianluca', 'Daniele'];
const COGNOMI = ['Ferrandi', 'Santini', 'Colombo', 'Barbieri', 'Marchetti', 'Galli', 'Ricci', 'Bruno', 'Conti', 'De Luca', 'Rinaldi', 'Serra', 'Villa', 'Testa', 'Fabbri', 'Longo', 'Mancini', 'Costa', 'Gatti', 'Pellegrini', 'Bianchi', 'Morandi', 'Farina', 'Sartori', 'Orlando', 'Damiani', 'Leone', 'Moretti', 'Neri', 'Vitale', 'Caruso', 'Basile', 'Ferraro', 'Cattaneo', 'Milani', 'Rizzo'];
const SQUADRE_SERIE_A = ['Vertoli', 'Ardenza', 'Portovento', 'Rocca Alta', "Sant'Elmo", 'Fiorenzuola', 'Castelverde', 'Montebruno'];

interface TemplateRuolo {
    classic: RuoloClassic;
    mantra: RuoloMantra[];
}

/** 6 slot per squadra: 1 portiere, 2 difensori, 2 centrocampisti, 1 attaccante. */
const TEMPLATE_RUOLI: TemplateRuolo[] = [
    { classic: 'POR', mantra: ['Por'] },
    { classic: 'DIF', mantra: ['Dc'] },
    { classic: 'DIF', mantra: ['Dd', 'B'] },
    { classic: 'CEN', mantra: ['M'] },
    { classic: 'CEN', mantra: ['E', 'C'] },
    { classic: 'ATT', mantra: ['A', 'Pc'] },
];

function avatarUrl(nome: string, cognome: string): string {
    const nomeCompleto = encodeURIComponent(`${nome} ${cognome}`);
    return `https://ui-avatars.com/api/?name=${nomeCompleto}&background=312e81&color=C7D2FE&bold=true`;
}

/** Statistiche pseudo-casuali ma deterministiche (stesso seed => stessi valori ad ogni reload). */
function statisticheDeterministiche(seed: number, template: TemplateRuolo) {
    const rand = ((seed * 9301 + 49297) % 233280) / 233280; // 0..1 deterministico

    if (template.classic === 'POR') {
        return { gol: 0, assist: 0, mediaVoto: +(5.8 + rand * 0.8).toFixed(2), fantaMedia: +(6 + rand * 0.9).toFixed(2) };
    }
    if (template.classic === 'ATT') {
        return { gol: Math.round(rand * 15), assist: Math.round(rand * 6), mediaVoto: +(5.9 + rand * 1).toFixed(2), fantaMedia: +(6.5 + rand * 1.5).toFixed(2) };
    }
    if (template.classic === 'CEN') {
        return { gol: Math.round(rand * 6), assist: Math.round(rand * 8), mediaVoto: +(5.9 + rand * 0.8).toFixed(2), fantaMedia: +(6.1 + rand * 1).toFixed(2) };
    }
    return { gol: Math.round(rand * 2), assist: Math.round(rand * 3), mediaVoto: +(5.8 + rand * 0.7).toFixed(2), fantaMedia: +(5.9 + rand * 0.8).toFixed(2) };
}

function creaGiocatore(indiceGlobale: number): GiocatoreRosa {
    const template = TEMPLATE_RUOLI[indiceGlobale % TEMPLATE_RUOLI.length];
    const nome = NOMI[indiceGlobale % NOMI.length];
    const cognome = COGNOMI[(indiceGlobale * 7) % COGNOMI.length];

    return {
        id: indiceGlobale + 1,
        nome,
        cognome,
        ruoloClassic: template.classic,
        ruoliMantra: template.mantra,
        squadraSerieA: SQUADRE_SERIE_A[indiceGlobale % SQUADRE_SERIE_A.length],
        immagineUrl: avatarUrl(nome, cognome),
        crediti: 10 + ((indiceGlobale * 13) % 90),
        statistiche: statisticheDeterministiche(indiceGlobale, template),
    };
}

const NUMERO_SQUADRE = 12;
const GIOCATORI_PER_SQUADRA = TEMPLATE_RUOLI.length;

export const MOCK_SQUADRE: SquadraFantacalcio[] = Array.from({ length: NUMERO_SQUADRE }, (_, squadraIdx) => ({
    id: squadraIdx + 1,
    nome: `Fantallenatore ${squadraIdx + 1}`,
    rosa: Array.from({ length: GIOCATORI_PER_SQUADRA }, (_, slotIdx) =>
        creaGiocatore(squadraIdx * GIOCATORI_PER_SQUADRA + slotIdx),
    ),
}));