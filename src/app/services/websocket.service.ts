import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

import { Player } from 'src/app/interfaces/player';
import { GridFromServer } from '../interfaces/interfaces';
import { Messages } from '../interfaces/messages';
import { CurrentScore, Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public getScore: Promise<Score[]> = this.socket.fromOneTimeEvent('getScore');
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

  // Observable recevant l'ordre des joueurs'
  public playersOrder$: Observable<number[]> =
    this.socket.fromEvent('playersOrder');

  // Lorsque le serveur signal que c'est à notre tour de jouer, renvoi le numéro de tour
  public myTurn$: Observable<number> = this.socket.fromEvent('yourTurn');

  // Le serveur envoi les prochains dominos dont des pions rois ont été placés
  public nextPickedDominoes$: Observable<any[]> =
    this.socket.fromEvent('nextPickedDominoes');

  // Le serveur accepte le déplacement du pion et permet de placer son domino
  public moveDomino$: Observable<string> = this.socket.fromEvent('moveDomino');

  // Le serveur a calculé que le domino ne peut être placé
  public cannotPlaceDomino$: Observable<number> =
    this.socket.fromEvent('cannotPlaceDomino');

  // Reçoit la grille du joueur avec les dominos dessus
  public myGrid$: Observable<GridFromServer[]> =
    this.socket.fromEvent('myGrid');

  // Reçoit la grille en booléen pour savoir si un domino peut être posé ou non
  public myDroppable$: Observable<boolean[][]> =
    this.socket.fromEvent('droppables');

  // Observable recevant les messages à afficher en haut de la page
  public messages$: Observable<Messages> = this.socket.fromEvent('message');

  public lastTurn$: Observable<never> = this.socket.fromEvent('lastTurn');

  public lastPick$: Observable<never> = this.socket.fromEvent('lastPick');

  public currentScore$: Observable<CurrentScore> =
    this.socket.fromEvent('currentScore');

  // Message reçu lorsqu'un joueur se deconnecte, provoquant la fin du jeu
  public lostConnection: Promise<string> =
    this.socket.fromOneTimeEvent('lostConnection');

  public logs$: Observable<string> = this.socket.fromEvent('logs');

  constructor(private socket: Socket) {}

  sendScoreRequest(): void {
    this.socket.emit('getScore');
  }

  startGame(): void {
    this.socket.emit('startGame');
  }
}
