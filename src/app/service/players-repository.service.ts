import { Injectable } from '@angular/core';
import { Player } from '../pages/components/asta-live/model/player.model';
import { MOCK_PLAYERS } from '../pages/components/asta-live/mock/mock-player';


/**
 * Astrazione sulla fonte dati dei giocatori.
 *
 * Oggi restituisce il mock locale. Quando il BE Java Spring Boot sarà pronto,
 * basterà sostituire il corpo dei metodi con chiamate HttpClient, ad es.:
 *
 *   getGiocatori(): Observable<Player[]> {
 *     return this.http.get<Player[]>('/api/v1/giocatori');
 *   }
 *
 * Endpoint REST suggeriti lato Spring Boot / MySQL:
 *   GET  /api/v1/giocatori              -> lista giocatori (con array ruoli)
 *   GET  /api/v1/ruoli                  -> metadati ruoli (se non li tieni statici in FE)
 *   POST /api/v1/aste                   -> crea una nuova sessione d'asta (config)
 *   POST /api/v1/aste/{id}/assegnazioni -> registra un'assegnazione (persistenza incrementale)
 *
 * Nota: se il metodo diventa asincrono, il chiamante (AstaService) andrà
 * adattato per gestire una Promise/Observable invece di un array sincrono.
 */
@Injectable({ providedIn: 'root' })
export class PlayersRepository {
  getGiocatori(): Player[] {
    return [...MOCK_PLAYERS];
  }
}