import { Component, OnInit } from '@angular/core';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {

  constructor(public scoreService: ScoreService) { }

  ngOnInit(): void {
    this.scoreService.getScore();
    this.scoreService.onGetScore().subscribe();
  }

}
