import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { Player } from 'src/app/interfaces/player';
import { Messages } from '../interfaces/messages';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // Observable recevant les mises à jour sur le joueur
  public player$: Observable<Player> = this.socket.fromEvent('myPlayer');
  // Observable recevant les mises à jour sur tous les joueurs
  public playersFromServer$: Observable<Player[]> =
    this.socket.fromEvent('allPlayers');

  // Message du serveur lorsque tous les joueurs sont prêts, on lance le jeu
  public startGameMessage: Promise<string> =
    this.socket.fromOneTimeEvent('startGame');

  // Observable recevant les dominos sur lesquels on peut jouer
  public currentDominoes$: Observable<number[]> =
    this.socket.fromEvent('currentDominoes');

  // Observable recevant les prochains dominos
  public nextDominoes$: Observable<number[]> =
    this.socket.fromEvent('nextDominoes');

  public playersOrder$: Observable<number[]> =
    this.socket.fromEvent('playersOrder');

  // Observable recevant les messages à afficher en haut de la page
  public messages$: Observable<Messages> = this.socket.fromEvent('message');

  // Lorsque le serveur signal que c'est à notre tour de jouer, renvoi le numéro de tour
  public myTurn$: Observable<number> = this.socket.fromEvent('yourTurn');

  // Le serveur envoi les prochains dominos dont des pions rois ont été placés
  public nextPickedDominoes$: Observable<any[]> =
    this.socket.fromEvent('nextPickedDominoes');

  // Le serveur accepte le déplacement du pion et permet de placer son domino
  public moveDomino$: Observable<string> = this.socket.fromEvent('moveDomino');

  // Reçoit la grille du joueur avec les dominos dessus
  public myGrid$: Observable<Object[]> = this.socket.fromEvent('myGrid');

  constructor(private socket: Socket) {}

  startGame(): void {
    this.socket.emit('startGame');
  }
}
