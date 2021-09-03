import { Injectable } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Socket } from 'ngx-socket-io';
import { share, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerInfoService {
  public player: Player = {
    pseudo: '',
    color: '',
    score: 0,
    canAccessToLobby: true, // TODO: changer la valeur à false
    canAccessToGame: false,
    readyToPlay: false
  };
  public players: Player[] = [];
  public playersFromServer$: Observable<Player[]> = this.socket.fromEvent('players').pipe(
    tap((result: any) => this.players = result),
    share()
  );
  public startGameMessage: Promise<string> = this.socket.fromOneTimeEvent('startGame');

  constructor(private socket: Socket) { }

  /**
   * Envoi le pseudo du nouveau joueur au serveur
   * @param pseudo le pseudo choisit par le joueur
   */
  newPlayer(pseudo: string): void {
    this.socket.emit('newPlayer', pseudo);
    this.socket.fromOneTimeEvent('newPlayer').then((returnedPlayer: any) => {
      this.player = returnedPlayer;
    });
  }

  chosenColor(color: string): void {
    this.socket.emit('chosenColor', {
      uid: this.player.uid,
      color: color
    });
  }

  playerIsReady(): void {
    this.socket.emit('playerIsReady', this.player.uid);
  }
}
