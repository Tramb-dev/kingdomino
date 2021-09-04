import { Component, OnInit } from '@angular/core';
import { PlayerInfoService } from 'src/app/services/player-info.service';
import { DominoesService } from 'src/app/services/dominoes.service';

@Component({
  selector: 'app-game-logs',
  templateUrl: './game-logs.component.html',
  styleUrls: ['./game-logs.component.scss']
})
export class GameLogsComponent implements OnInit {
  logs = [];

  constructor(
    private playerInfo: PlayerInfoService,
    private dominoesService: DominoesService
  ) { }

  ngOnInit(): void {
    
  }

}
