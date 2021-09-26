import { Injectable } from '@angular/core';
import { Score, ScoreSheet } from '../interfaces/score';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  public scoreSheet: ScoreSheet = {
    lastScores: [],
    bestScores: [],
  };

  constructor(private websocket: WebsocketService) {}

  async getScore(): Promise<ScoreSheet> {
    this.websocket.sendScoreRequest();
    return await this.websocket.getScore.then(
      (results: ScoreSheet) => (this.scoreSheet = results)
    );
  }
}
