import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { Score } from '../interfaces/score';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  public scoreSheet: Score[] = [];

  constructor(private socket: Socket) { }

  getScore(): void {
    this.socket.emit('getScore');
  }
  
  onGetScore(): Observable<Score> {
    return this.socket.fromEvent('getScore').pipe(
      tap((results: any) => this.scoreSheet = results)
    );
  }
}
