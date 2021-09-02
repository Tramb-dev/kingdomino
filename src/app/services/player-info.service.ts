import { Injectable } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Socket } from 'ngx-socket-io';
import { share, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PlayerInfoService {
  public player: Player = {
    pseudo: 'test',
    color: '',
    score: 0,
    canAccessToLobby: true, // TODO: changer la valeur à false
    canAccessToGame: false,
    readyToPlay: false
  };
  public players: Player[] = [
    // TODO: retirer ce test
    {
      pseudo: 'Tramb',
      color: 'blue',
      readyToPlay: false,
      uid: '4cf89ce7-aaea-47ff-be20-0534b9c74c4a'
    },
    {
      pseudo: 'test',
      color: 'green',
      readyToPlay: false,
      uid: '4cf89ce7-aaea-47ff-be20-0534b9c74c4b'
    }
  ];
  public playersFromServer$: Observable<Player[]> = this.socket.fromEvent('players').pipe(
    tap((result: any) => this.players = result),
    share()
  );

  constructor(private socket: Socket) { }

  /**
   * Envoi le pseudo du nouveau joueur au serveur
   * @param pseudo le pseudo choisit par le joueur
   */
  newPlayer(pseudo: string): void {
    this.player.uid = uuidv4();
    this.socket.emit('newPlayer', {
      pseudo: pseudo,
      uid: this.player.uid
    });
  }

  chosenColor(color: string): void {
    this.socket.emit('chosenColor', {
      uid: this.player.uid,
      color: color
    });
  }

  playerIsReady(): void {
    this.socket.emit('playerIsReady', {
      uid: this.player.uid
    });
  }
}
