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

  // Observable recevant les messages à afficher en haut de la page
  public messages$: Observable<Messages> = this.socket.fromEvent('message');

  constructor(private socket: Socket) {}

  startGame(): void {
    this.socket.emit('startGame');
  }
}
