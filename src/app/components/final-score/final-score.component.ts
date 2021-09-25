import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentScore } from 'src/app/interfaces/score';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-final-score',
  templateUrl: './final-score.component.html',
  styleUrls: ['./final-score.component.scss'],
})
export class FinalScoreComponent implements OnInit {
  gameIsEnded = false;
  winner: CurrentScore = {
    pseudo: 'test',
    score: 0,
  };
  endOfGameSubscription: Subscription;

  constructor(private wesocket: WebsocketService) {
    this.endOfGameSubscription = this.wesocket.endOfGame$.subscribe(
      (player) => {
        this.gameIsEnded = true;
        this.winner = {
          pseudo: player.pseudo,
          score: player.score,
        };
        this.endOfGameSubscription.unsubscribe();
      }
    );
  }

  ngOnInit(): void {}
}
