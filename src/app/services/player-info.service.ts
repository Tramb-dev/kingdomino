import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Player } from 'src/app/interfaces/player';
import { Castles } from '../interfaces/castles';

@Injectable({
  providedIn: 'root'
})
export class PlayerInfoService {
  public player: Player = {
    pseudo: '',
    color: 'green',
    score: 0,
    canAccessToLobby: true, // TODO: changer la valeur à false
    canAccessToGame: false,
    readyToPlay: false
  };
  public players: Player[] = [];
  private myPlayerSubscription: Subscription;
  private allPlayersSubscription: Subscription;
  public castles: Castles = {
    pink: false,
    green: false,
    yellow: false,
    blue: false
  };

  constructor(
    private socket: Socket, 
    private websocket: WebsocketService
  ) {
      // TODO: Pour test uniquement
    this.players = [
      {
        pseudo: "Tramb",
        color: "blue",
        uid: "1",
        readyToPlay: true,
      },
    ]

    this.myPlayerSubscription = this.websocket.player$.subscribe(
      value => {
        this.player = value;
      }
    );
    this.allPlayersSubscription = this.websocket.playersFromServer$.subscribe(
      value => {
        this.players = value;
        // On remet tous les châteaux à false avant de leur donner la vraie valeur
        for(let castle in this.castles) {
          this.castles[castle] = false;
        }
        value.forEach(player => {
          if(player.color) {
            this.castles[player.color] = player.pseudo;
          }
        })
      }
    );
  }

  /**
   * Envoi le pseudo du nouveau joueur au serveur
   * @param pseudo le pseudo choisit par le joueur
   */
  newPlayer(pseudo: string): void {
    this.socket.emit('newPlayer', pseudo);
  }

  /**
   * Envoi la couleur choisit par le joueur
   * @param color la couleur choisit
   */
  chosenColor(color: string): void {
    this.socket.emit('chosenColor', {
      uid: this.player.uid,
      color: color
    });
  }

  /**
   * Envoi au serveur que le joueur est prêt
   */
  playerIsReady(): void {
    this.socket.emit('playerIsReady', this.player.uid);
  }
}
