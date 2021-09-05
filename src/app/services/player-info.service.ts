import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { WebsocketService } from './websocket.service';

import { Player } from 'src/app/interfaces/player';
import { Castles } from 'src/app/interfaces/castles';
import { Messages } from '../interfaces/messages';
import { King } from '../interfaces/king';

@Injectable({
  providedIn: 'root',
})
export class PlayerInfoService {
  public player: Player = {
    pseudo: '',
    color: 'green',
    score: 0,
    canAccessToLobby: true, // TODO: changer la valeur à false
    canAccessToGame: false,
    readyToPlay: false,
  };
  public players: Player[] = [];
  public myPlayerSubscription: Subscription;
  public allPlayersSubscription: Subscription;
  public playersOrderSubcription: Subscription;
  public playerMessageSubscription: Subscription;
  public nextPickedDominoesSubscription: Subscription;
  public playersOrder: Player[] = [];
  public kingsPosition: King[] = [];
  public myTurn: boolean = false;
  public castles: Castles = {
    pink: false,
    green: false,
    yellow: false,
    blue: false,
  };

  constructor(private socket: Socket, private websocket: WebsocketService) {
    // TODO: Pour test uniquement
    this.players = [
      {
        pseudo: 'Tramb',
        color: 'blue',
        uid: '1',
        readyToPlay: true,
      },
    ];

    this.myPlayerSubscription = this.websocket.player$.subscribe((value) => {
      this.player = value;
    });

    this.allPlayersSubscription = this.websocket.playersFromServer$.subscribe(
      (value) => {
        this.players = value;
        // On remet tous les châteaux à false avant de leur donner la vraie valeur
        for (let castle in this.castles) {
          this.castles[castle] = false;
        }
        value.forEach((player) => {
          if (player.color) {
            this.castles[player.color] = player.pseudo;
          }
        });
      }
    );

    this.playersOrderSubcription = this.websocket.playersOrder$
      .pipe(
        tap((data: number[]) => {
          for (let i = 0; i < data.length; i++) {
            this.kingsPosition[i] = {
              left: '81.5px',
              top: i * (100 + 6) + 30 + 'px',
              player: data[i],
            };
          }
        }),
        map((data: number[]) => {
          const switchNumberToPlayer: Player[] = [];
          data.forEach((element) => {
            switchNumberToPlayer.push(this.players[element]);
          });
          return switchNumberToPlayer;
        })
      )
      .subscribe((value) => {
        this.playersOrder = value;
      });

    this.playerMessageSubscription = this.websocket.messages$.subscribe(
      (value: Messages) => {
        if (value.type === 'yourTurn') {
          this.myTurn = true;
        } else {
          this.myTurn = false;
        }
      }
    );

    this.nextPickedDominoesSubscription =
      this.websocket.nextPickedDominoes$.subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i]) {
            this.kingsPosition[data[i].king] = {
              left: '368px',
              top: i * (100 + 6) + 30 + 'px',
              player: data[i].player,
            };
          }
        }
      });
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
      color: color,
    });
  }

  /**
   * Envoi au serveur que le joueur est prêt
   */
  playerIsReady(): void {
    this.socket.emit('playerIsReady', this.player.uid);
  }

  /**
   * Envoi au serveur le domino choisit
   * @param numero le numéro du domino choisit
   */
  sendChosenDomino(numero: number) {
    this.socket.emit('chosenDomino', numero);
  }
}
