import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebsocketService } from './websocket.service';

import { Messages } from '../interfaces/messages';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  public messagesSubscription: Subscription;
  public messageToDisplay: string = '';

  constructor(private websocket: WebsocketService) {
    this.messagesSubscription = this.websocket.messages$.subscribe(
      (value: Messages) => {
        switch (value.type) {
          case 'isTurnOf':
            this.messageToDisplay = `C'est au tour de ${value.data}`;
            break;

          case 'yourTurn':
            this.messageToDisplay = `C'est à votre tour de jouer ${value.data}`;
            break;
        }
      }
    );
  }
}
