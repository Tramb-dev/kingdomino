import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { WebsocketService } from './websocket.service';

import { Player } from 'src/app/interfaces/player';
import { Castles } from 'src/app/interfaces/castles';
import { Messages } from '../interfaces/messages';
import { King } from '../interfaces/king';
import { GridPosition } from '../interfaces/interfaces';
import { Domino } from '../interfaces/interfaces';
import { CurrentScore } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class PlayerInfoService {
  public player: Player = {
    pseudo: '',
    color: 'green',
    score: 0,
    canAccessToLobby: false, // TODO: changer la valeur à false
    canAccessToGame: false,
    readyToPlay: false,
    canPlaceDomino: true,
    canPlaceKing: false,
    isTurn: false,
  };
  public players: Player[] = [];
  private myPlayerSubscription: Subscription;
  private allPlayersSubscription: Subscription;
  private playersOrderSubcription: Subscription;
  private playerMessageSubscription: Subscription;
  private nextPickedDominoesSubscription: Subscription;
  public nextPickedDominoes: boolean[] = [false, false, false, false];
  private moveDominoSubscription: Subscription;
  public playersOrder: Player[] = [];
  public kingsPosition: King[] = [];
  private currentDominoesSubscription: Subscription;
  private lastTurnSubscription: Subscription;
  private currentScoreSubscription: Subscription;
  public lastTurn = false;
  public castles: Castles = {
    pink: false,
    green: false,
    yellow: false,
    blue: false,
  };

  constructor(private socket: Socket, private websocket: WebsocketService) {
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
          this.nextPickedDominoes = [false, false, false, false];
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

    this.lastTurnSubscription = this.websocket.lastTurn$.subscribe(() => {
      this.lastTurn = true;
      this.lastTurnSubscription.unsubscribe();
    });

    this.playerMessageSubscription = this.websocket.messages$.subscribe(
      (value: Messages) => {
        switch (value.type) {
          case 'placedDomino':
            if (value.data === 'ok') {
              this.player.canPlaceDomino = false;
            }
            break;

          case 'yourTurn':
            this.player.isTurn = true;
            if (this.lastTurn) {
              this.player.canPlaceDomino = true;
              this.player.canPlaceKing = false;
            } else {
              this.player.canPlaceKing = true;
            }
            break;

          case 'turnOf':
            this.player.isTurn = false;
            this.player.canPlaceKing = false;
            this.player.canPlaceDomino = false;
            break;
        }
      }
    );

    this.nextPickedDominoesSubscription =
      this.websocket.nextPickedDominoes$.subscribe((data: any[]) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i]) {
            this.nextPickedDominoes[i] = true;
            this.kingsPosition[data[i].king] = {
              left: '368px',
              top: i * (100 + 6) + 30 + 'px',
              player: data[i].player,
            };
          } else {
            this.nextPickedDominoes[i] = false;
          }
        }
      });

    this.moveDominoSubscription = this.websocket.moveDomino$.subscribe(
      (uid: string) => {
        if (uid === this.player.uid) {
          this.player.canPlaceDomino = true;
        }
      }
    );

    this.currentDominoesSubscription =
      this.websocket.currentDominoes$.subscribe((value: number[]) => {
        const diffBetweenKingsAndLastDominoes =
          this.kingsPosition.length - value.length;
        for (
          let i = this.kingsPosition.length;
          i > diffBetweenKingsAndLastDominoes;
          i--
        ) {
          this.kingsPosition[i - 1].top =
            (i - 1 - diffBetweenKingsAndLastDominoes) * (100 + 6) + 30 + 'px';
        }
      });

    this.currentScoreSubscription = this.websocket.currentScore$.subscribe(
      (value: CurrentScore) => {
        const index: number = this.players.findIndex(
          (player) => player.pseudo === value.pseudo
        );
        if (index > -1) {
          this.players[index].score = value.score;
        }
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
  sendChosenDomino(numero: number): void {
    this.socket.emit('chosenDomino', numero);
    this.player.canPlaceKing = false;
  }

  sendPlacedDomino(gridPosition: GridPosition, placedDomino: Domino): void {
    this.socket.emit('placedDomino', {
      numero: placedDomino.numero,
      orientation: placedDomino.orientation,
      left: placedDomino.left,
      right: placedDomino.right,
      gridPosition: {
        row: gridPosition.row,
        col: gridPosition.col,
      },
    });
  }
}
