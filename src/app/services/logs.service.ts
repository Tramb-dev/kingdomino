import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Messages, Log } from '../interfaces/messages';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private messagesSubscription: Subscription;
  public messageToDisplay: string = '';
  public logs: Log[] = [];
  public dateLog: Date = new Date();
  private logsSubcription: Subscription;
  private nextDominoesSubscription: Subscription;
  private lastPickSubscription: Subscription;
  private lastTurnSubscription: Subscription;
  private endOfGameSubscription: Subscription;

  constructor(private websocket: WebsocketService) {
    this.messagesSubscription = this.websocket.messages$.subscribe(
      (value: Messages) => {
        switch (value.type) {
          case 'turnOf':
            this.messageToDisplay = `C'est au tour de ${value.data}.`;
            break;

          case 'yourTurn':
            this.messageToDisplay = `C'est à votre tour de jouer ${value.data}.`;
            break;
        }
      }
    );

    this.websocket.lostConnection.then((value: string) => {
      this.messageToDisplay = `Le joueur ${value} s'est déconnecté. Fin de la partie. :(`;
    });

    this.logsSubcription = this.websocket.logs$.subscribe((value: string) => {
      const date = new Date();
      const log = {
        date:
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        log: value,
      };
      this.logs.unshift(log);
    });

    this.nextDominoesSubscription = this.websocket.nextDominoes$.subscribe(
      (value: number[]) => {
        const date = new Date();
        const log = {
          date:
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
          log: `Nouveau dominos tirés : ${value}.`,
        };
        this.logs.unshift(log);
      }
    );

    this.lastPickSubscription = this.websocket.lastPick$.subscribe(() => {
      const date = new Date();
      const log = {
        date:
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        log: `Dernier choix de domino, choisissez bien !`,
      };
      this.logs.unshift(log);
      this.lastPickSubscription.unsubscribe();
    });

    this.lastTurnSubscription = this.websocket.lastTurn$.subscribe(() => {
      const date = new Date();
      const log = {
        date:
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        log: `Dernier tour !`,
      };
      this.logs.unshift(log);
      this.lastTurnSubscription.unsubscribe();
    });

    this.endOfGameSubscription = this.websocket.endOfGame$.subscribe(() => {
      this.messagesSubscription.unsubscribe();
      this.logsSubcription.unsubscribe();
      this.nextDominoesSubscription.unsubscribe();
      this.endOfGameSubscription.unsubscribe();
    });
  }
}
