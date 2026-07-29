import { Player, RuoloMantra } from "../model/player.model";

interface BasePlayer {
    id: number;
    nome: string;
    cognome: string;
    ruoli: RuoloMantra[];
    squadra: string;
    nazionalita: string;
}

/**
 * ATTENZIONE: dataset fittizio a scopo dimostrativo (nomi, squadre e nazionalità inventati).
 * Sostituiscilo con la chiamata reale al BE (vedi players-repository.service.ts).
 */
const BASE: BasePlayer[] = [
    { id: 1, nome: 'Marco', cognome: 'Ferrandi', ruoli: ['Por'], squadra: 'Vertoli', nazionalita: 'ITA' },
    { id: 2, nome: 'Luca', cognome: 'Santini', ruoli: ['Por'], squadra: 'Ardenza', nazionalita: 'ITA' },
    { id: 3, nome: 'Davide', cognome: 'Colombo', ruoli: ['Por'], squadra: 'Portovento', nazionalita: 'ARG' },
    // { id: 4, nome: 'Simone', cognome: 'Barbieri', ruoli: ['Por'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 5, nome: 'Andrea', cognome: 'Marchetti', ruoli: ['Por'], squadra: 'Vertoli', nazionalita: 'BRA' },
    // { id: 6, nome: 'Federico', cognome: 'Galli', ruoli: ['Dc'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 7, nome: 'Alessio', cognome: 'Ricci', ruoli: ['Dd'], squadra: 'Portovento', nazionalita: 'ESP' },
    // { id: 8, nome: 'Matteo', cognome: 'Bruno', ruoli: ['Ds'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 9, nome: 'Gabriele', cognome: 'Conti', ruoli: ['Dc', 'B'], squadra: 'Vertoli', nazionalita: 'FRA' },
    // { id: 10, nome: 'Riccardo', cognome: 'De Luca', ruoli: ['Dd'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 11, nome: 'Tommaso', cognome: 'Rinaldi', ruoli: ['Ds'], squadra: 'Portovento', nazionalita: 'CRO' },
    // { id: 12, nome: 'Nicola', cognome: 'Serra', ruoli: ['Dc'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 13, nome: 'Giacomo', cognome: 'Villa', ruoli: ['B'], squadra: 'Vertoli', nazionalita: 'SRB' },
    // { id: 14, nome: 'Filippo', cognome: 'Testa', ruoli: ['Dd'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 15, nome: 'Emanuele', cognome: 'Fabbri', ruoli: ['Ds'], squadra: 'Portovento', nazionalita: 'POR' },
    // { id: 16, nome: 'Christian', cognome: 'Longo', ruoli: ['M'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 17, nome: 'Leonardo', cognome: 'Mancini', ruoli: ['C'], squadra: 'Vertoli', nazionalita: 'ITA' },
    // { id: 18, nome: 'Samuele', cognome: 'Costa', ruoli: ['E'], squadra: 'Ardenza', nazionalita: 'NED' },
    // { id: 19, nome: 'Cristian', cognome: 'Gatti', ruoli: ['M', 'C'], squadra: 'Portovento', nazionalita: 'ITA' },
    // { id: 20, nome: 'Diego', cognome: 'Pellegrini', ruoli: ['E'], squadra: 'Rocca Alta', nazionalita: 'ARG' },
    // { id: 21, nome: 'Manuel', cognome: 'Bianchi', ruoli: ['C'], squadra: 'Vertoli', nazionalita: 'ITA' },
    // { id: 22, nome: 'Stefano', cognome: 'Morandi', ruoli: ['M'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 23, nome: 'Michele', cognome: 'Farina', ruoli: ['E'], squadra: 'Portovento', nazionalita: 'BRA' },
    // { id: 24, nome: 'Antonio', cognome: 'Sartori', ruoli: ['C'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 25, nome: 'Giulio', cognome: 'Orlando', ruoli: ['M', 'E'], squadra: 'Vertoli', nazionalita: 'ENG' },
    // { id: 26, nome: 'Alberto', cognome: 'Damiani', ruoli: ['A'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 27, nome: 'Vincenzo', cognome: 'Leone', ruoli: ['W'], squadra: 'Portovento', nazionalita: 'ITA' },
    // { id: 28, nome: 'Salvatore', cognome: 'Moretti', ruoli: ['Pc'], squadra: 'Rocca Alta', nazionalita: 'ARG' },
    // { id: 29, nome: 'Christian', cognome: 'Neri', ruoli: ['T'], squadra: 'Vertoli', nazionalita: 'ITA' },
    // { id: 30, nome: 'Lorenzo', cognome: 'Vitale', ruoli: ['A'], squadra: 'Ardenza', nazionalita: 'BRA' },
    { id: 31, nome: 'Raffaele', cognome: 'Caruso', ruoli: ['W', 'T', 'A'], squadra: 'Portovento', nazionalita: 'ITA' },
    // { id: 32, nome: 'Enrico', cognome: 'Basile', ruoli: ['Pc'], squadra: 'Rocca Alta', nazionalita: 'CRO' },
    // { id: 33, nome: 'Pietro', cognome: 'Ferraro', ruoli: ['Dd'], squadra: 'Vertoli', nazionalita: 'ITA' },
    // { id: 34, nome: 'Jacopo', cognome: 'Cattaneo', ruoli: ['B'], squadra: 'Ardenza', nazionalita: 'ITA' },
    // { id: 35, nome: 'Edoardo', cognome: 'Milani', ruoli: ['C'], squadra: 'Portovento', nazionalita: 'ESP' },
    // { id: 36, nome: 'Gianluca', cognome: 'Rizzo', ruoli: ['M'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
    // { id: 37, nome: 'Daniele', cognome: 'Piras', ruoli: ['T', 'A'], squadra: 'Vertoli', nazionalita: 'ITA' },
    // { id: 38, nome: 'Fabio', cognome: 'Monti', ruoli: ['A'], squadra: 'Ardenza', nazionalita: 'SRB' },
    // { id: 39, nome: 'Claudio', cognome: 'Amato', ruoli: ['E', 'C'], squadra: 'Portovento', nazionalita: 'ITA' },
    // { id: 40, nome: 'Roberto', cognome: 'Silvestri', ruoli: ['Dc'], squadra: 'Rocca Alta', nazionalita: 'ITA' },
];

function avatarUrl(nome: string, cognome: string): string {
    const nomeCompleto = encodeURIComponent(`${nome} ${cognome}`);
    return `https://ui-avatars.com/api/?name=${nomeCompleto}&background=0f2b21&color=D4AF37&bold=true`;
}

export const MOCK_PLAYERS: Player[] = BASE.map((p) => ({
    ...p,
    immagineUrl: avatarUrl(p.nome, p.cognome),
}));