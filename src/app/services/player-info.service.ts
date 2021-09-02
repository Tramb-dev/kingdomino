import { Injectable } from '@angular/core';
import { Player } from 'src/app/interfaces/player';
import { Socket } from 'ngx-socket-io';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerInfoService {
  public player: Player = {
    name: '',
    color: '',
    score: 0,
    canAccessToLobby: true, // TODO: changer la valeur à false
    canAccessToGame: false,
  };
  public players: Player[] = [];

  constructor(private socket: Socket) { }

  newPlayer(pseudo: string): Observable<Player[]> {
    this.socket.emit('newPlayer', pseudo);
    return this.socket.fromEvent('players').pipe(
      tap((results: any) => this.players = results)
    )
  }
}
