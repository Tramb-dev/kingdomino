import { Injectable } from '@angular/core';
import { Score } from '../interfaces/score';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  public scoreSheet: Score[] = [];

  constructor(private websocket: WebsocketService) {}

  async getScore(): Promise<Score[]> {
    this.websocket.sendScoreRequest();
    return await this.websocket.getScore.then(
      (results: Score[]) => (this.scoreSheet = results)
    );
  }
}
